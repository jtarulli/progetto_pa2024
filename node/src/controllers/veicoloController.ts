import { Request, Response } from 'express';
import { Veicolo } from '../models/veicolo';

// Funzione per creare un nuovo veicolo
export const createVeicolo = async (req: Request, res: Response) => {
    try {
        // Creazione del veicolo nel database
        const veicolo = await Veicolo.create(req.body);
        // Risposta con il veicolo creato
        res.status(201).json(veicolo);
    } catch (error) {
        // Gestione errore, restituisce un messaggio di errore interno del server
        res.status(500).json({ message: 'Errore nella creazione del veicolo', error });
    }
};

// Funzione per ottenere tutti i veicoli
export const getVeicoli = async (req: Request, res: Response) => {
    try {
        // Recupero di tutti i veicoli dal database
        const veicoli = await Veicolo.findAll();
        // Risposta con i veicoli trovati
        res.status(200).json(veicoli);
    } catch (error) {
        // Gestione errore, restituisce un messaggio di errore interno del server
        res.status(500).json({ message: 'Errore nel recupero dei veicoli', error });
    }
};

// Funzione per ottenere un veicolo tramite la sua targa
export const getVeicoloById = async (req: Request, res: Response) => {
    try {
        // Recupero del veicolo dal database tramite targa
        const veicolo = await Veicolo.findByPk(req.params.targa);
        if (veicolo) {
            // Risposta con il veicolo trovato
            res.status(200).json(veicolo);
        } else {
            // Gestione errore, veicolo non trovato
            res.status(404).json({ message: 'Veicolo non trovato' });
        }
    } catch (error) {
        // Gestione errore, restituisce un messaggio di errore interno del server
        res.status(500).json({ message: 'Errore nel recupero del veicolo', error });
    }
};

// Funzione per cancellare un veicolo
export const deleteVeicolo = async (req: Request, res: Response) => {
    try {
        // Cancellazione del veicolo nel database
        const deleted = await Veicolo.destroy({
            where: { targa: req.params.targa }
        });
        if (deleted) {
            // Risposta di successo senza contenuto
            res.status(204).send();
        } else {
            // Gestione errore, veicolo non trovato
            res.status(404).json({ message: 'Veicolo non trovato' });
        }
    } catch (error) {
        // Gestione errore, restituisce un messaggio di errore interno del server
        res.status(500).json({ message: 'Errore nella cancellazione del veicolo', error });
    }
};
