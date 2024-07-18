import { Request, Response } from 'express';
import { Whitelist } from '../models/whitelist';

// Crea una nuova entry nella whitelist
export const createWhitelist = async (req: Request, res: Response) => {
    try {
        // Creazione di un nuovo record nella whitelist con i dati ricevuti
        const whitelist = await Whitelist.create(req.body);
        // Risposta con il record creato
        res.status(201).json(whitelist);
    } catch (error) {
        // Gestione errore, restituisce un messaggio di errore interno del server
        res.status(500).json({ message: 'Errore nella creazione della whitelist', error });
    }
};

// Ottieni tutte le entries nella whitelist
export const getAllWhitelists = async (req: Request, res: Response) => {
    try {
        // Recupero di tutti i record nella whitelist
        const whitelists = await Whitelist.findAll();
        // Risposta con tutti i record trovati
        res.status(200).json(whitelists);
    } catch (error) {
        // Gestione errore, restituisce un messaggio di errore interno del server
        res.status(500).json({ message: 'Errore nel recupero della whitelist', error });
    }
};

// Ottieni una singola entry della whitelist per targa veicolo
export const getWhitelistByTarga = async (req: Request, res: Response) => {
    try {
        // Ottieni la targa_veicolo dai parametri della richiesta
        const { targa_veicolo } = req.params;

        // Cerca il record nella whitelist dove targa_veicolo corrisponde al valore fornito
        const whitelist = await Whitelist.findOne({ where: { targa_veicolo } });

        if (whitelist) {
            // Risposta con il record trovato
            res.status(200).json(whitelist);
        } else {
            // Gestione errore, record non trovato
            res.status(404).json({ message: 'Whitelist non trovata per la targa specificata' });
        }
    } catch (error) {
        // Gestione errore, restituisce un messaggio di errore interno del server
        res.status(500).json({ message: 'Errore nel recupero della whitelist', error });
    }
};

// Aggiorna una entry della whitelist per ID
export const updateWhitelist = async (req: Request, res: Response) => {
    try {
        // Aggiornamento del record nella whitelist con i nuovi dati forniti
        const [updated] = await Whitelist.update(req.body, {
            where: { id: req.params.id }
        });
        if (updated) {
            // Recupero e risposta con il record aggiornato
            const updatedWhitelist = await Whitelist.findByPk(req.params.id);
            res.status(200).json(updatedWhitelist);
        } else {
            // Gestione errore, record non trovato
            res.status(404).json({ message: 'Whitelist non trovata' });
        }
    } catch (error) {
        // Gestione errore, restituisce un messaggio di errore interno del server
        res.status(500).json({ message: 'Errore nell\'aggiornamento della whitelist', error });
    }
};

// Elimina una entry della whitelist per ID
export const deleteWhitelist = async (req: Request, res: Response) => {
    try {
        // Cancellazione del record nella whitelist
        const deleted = await Whitelist.destroy({
            where: { id: req.params.id }
        });
        if (deleted) {
            // Risposta di successo senza contenuto
            res.status(204).send();
        } else {
            // Gestione errore, record non trovato
            res.status(404).json({ message: 'Whitelist non trovata' });
        }
    } catch (error) {
        // Gestione errore, restituisce un messaggio di errore interno del server
        res.status(500).json({ message: 'Errore nella cancellazione della whitelist', error });
    }
};
