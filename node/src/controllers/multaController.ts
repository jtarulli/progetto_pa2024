import { Request, Response } from 'express';
import { Multa } from '../models/multa';
import { Veicolo } from '../models/veicolo';
import { generateMultaPDF } from '../utils/pdfGenerator';
import { getUserByEmail } from '../db/utenteQueries';
import { decodeJwt } from '../utils/jwtUtils';

// Funzione per creare una nuova multa
export const createMulta = async (req: Request, res: Response) => {
    try {
        const multa = await Multa.create(req.body); // Creazione della multa nel database
        res.status(201).json(multa); // Risposta con la multa creata e status 201
    } catch (error) {
        res.status(500).json({ message: 'Errore nella creazione della multa', error }); // Gestione errore con status 500
    }
};

// Funzione per recuperare tutte le multe
export const getMulte = async (req: Request, res: Response) => {
    try {
        const multe = await Multa.findAll(); // Recupero di tutte le multe dal database
        res.status(200).json(multe); // Risposta con tutte le multe e status 200
    } catch (error) {
        res.status(500).json({ message: 'Errore nel recupero delle multe', error }); // Gestione errore con status 500
    }
};

// Funzione per recuperare una multa tramite ID
export const getMultaById = async (req: Request, res: Response) => {
    try {
        const multa = await Multa.findByPk(req.params.id); // Recupero della multa tramite ID
        if (multa) {
            res.status(200).json(multa); // Risposta con la multa trovata e status 200
        } else {
            res.status(404).json({ message: 'Multa non trovata' }); // Multa non trovata, status 404
        }
    } catch (error) {
        res.status(500).json({ message: 'Errore nel recupero della multa', error }); // Gestione errore con status 500
    }
};

// Funzione per aggiornare una multa esistente
export const updateMulta = async (req: Request, res: Response) => {
    try {
        const [updated] = await Multa.update(req.body, {
            where: { id: req.params.id }
        }); // Aggiornamento della multa nel database
        if (updated) {
            const updatedMulta = await Multa.findByPk(req.params.id); // Recupero della multa aggiornata
            res.status(200).json(updatedMulta); // Risposta con la multa aggiornata e status 200
        } else {
            res.status(404).json({ message: 'Multa non trovata' }); // Multa non trovata, status 404
        }
    } catch (error) {
        res.status(500).json({ message: 'Errore nell\'aggiornamento della multa', error }); // Gestione errore con status 500
    }
};

// Funzione per eliminare una multa
export const deleteMulta = async (req: Request, res: Response) => {
    try {
        const deleted = await Multa.destroy({
            where: { id: req.params.id }
        }); // Eliminazione della multa nel database
        if (deleted) {
            res.status(204).send(); // Multa eliminata con successo, nessun contenuto, status 204
        } else {
            res.status(404).json({ message: 'Multa non trovata' }); // Multa non trovata, status 404
        }
    } catch (error) {
        res.status(500).json({ message: 'Errore nella cancellazione della multa', error }); // Gestione errore con status 500
    }
};

// Funzione per scaricare il PDF di una multa
export const downloadMultaPDF = async (req: Request, res: Response) => {
    try {
        const multa = await Multa.findByPk(req.params.id); // Recupero della multa tramite ID
        if (multa) {
            const pdfBuffer = await generateMultaPDF(multa); // Generazione del PDF della multa
            await multa.update({is_pagata: true}); // Aggiornamento dello stato della multa a "pagata"
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=bollettino.pdf`);
            res.send(pdfBuffer); // Invio del PDF come risposta
        } else {
            res.status(404).json({ message: 'Multa non trovata' }); // Multa non trovata, status 404
        }
    } catch (error) {
        res.status(500).json({ message: 'Errore nella generazione del PDF', error }); // Gestione errore con status 500
    }
};

// Funzione per recuperare le multe di un automobilista
export const getMultePerAutomobilista = async (req: Request, res: Response) => {
    try {
        const jwtBearerToken = req.headers.authorization; // Recupero del token JWT dall'header di autorizzazione
        const jwtDecode = jwtBearerToken ? decodeJwt(jwtBearerToken) : null; // Decodifica del token JWT

        if (jwtDecode) {
            const user = await getUserByEmail(jwtDecode.email); // Recupero dell'utente tramite email decodificata
            if (!user.length) {
                return res.status(404).json({ message: 'Utente non trovato' }); // Utente non trovato, status 404
            }

            const userId = user[0].id;
            const veicoli = await Veicolo.findAll({ where: { proprietario_id: userId } }); // Recupero dei veicoli dell'utente

            if (!veicoli.length) {
                return res.status(404).json({ message: 'Nessun veicolo associato trovato' }); // Nessun veicolo associato trovato, status 404
            }

            const targhe = veicoli.map(veicolo => veicolo.targa); // Creazione array di targhe dei veicoli dell'utente
            const multe = await Multa.findAll({ where: { targa_veicolo: targhe } }); // Recupero delle multe associate alle targhe

            return res.status(200).json(multe); // Risposta con le multe trovate e status 200
        } else {
            return res.status(401).json({ message: 'Utente non autorizzato' }); // Utente non autorizzato, status 401
        }
    } catch (error) {
        console.error('Errore nel recupero delle multe:', error); // Log dell'errore
        return res.status(500).json({ message: 'Errore interno del server' }); // Gestione errore con status 500
    }
};
