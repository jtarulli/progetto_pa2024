import { Request, Response } from 'express';
import { Varco } from '../models/varco';
import { MessageGenerator } from '../messages/messaggiHandler';
import { StatusCodes, Messages500, Messages204, Messages200 } from '../messages/messaggi';

// Funzione per creare un nuovo varco
export const createVarco = async (req: Request, res: Response) => {
    try {
        // Creazione del varco nel database
        const varco = await Varco.create(req.body);
        // Risposta con il varco creato
        res.status(201).json(varco);
    } catch (error) {
        // Gestione errore, restituisce un messaggio di errore interno del server
        return MessageGenerator.getStatusMessage(StatusCodes.INTERNAL_SERVER_ERROR, res, Messages500.InternalServerError);
    }
};

// Funzione per ottenere tutti i varchi
export const getVarchi = async (req: Request, res: Response) => {
    try {
        // Recupero di tutti i varchi dal database, includendo i dati Ztl associati
        const varchi = await Varco.findAll({ include: 'Ztl' });
        // Risposta con i varchi trovati
        res.status(200).json(varchi);
    } catch (error) {
        // Gestione errore, restituisce un messaggio di errore interno del server
        return MessageGenerator.getStatusMessage(StatusCodes.INTERNAL_SERVER_ERROR, res, Messages500.InternalServerError);
    }
};

// Funzione per ottenere un varco tramite il suo ID
export const getVarcoById = async (req: Request, res: Response) => {
    try {
        // Recupero del varco dal database tramite ID
        const varco = await Varco.findByPk(req.params.id);
        // Risposta con il varco trovato
        res.status(200).json(varco);
    } catch (error) {
        // Gestione errore, restituisce un messaggio di errore interno del server
        return MessageGenerator.getStatusMessage(StatusCodes.INTERNAL_SERVER_ERROR, res, Messages500.InternalServerError);
    }
};

// Funzione per aggiornare un varco
export const updateVarco = async (req: Request, res: Response) => {
    try {
        // Aggiornamento del varco nel database
        const [updated] = await Varco.update(req.body, {
            where: { id: req.params.id }
        });
        // Recupero e risposta con il varco aggiornato
        const updatedVarco = await Varco.findByPk(req.params.id);
        return MessageGenerator.getStatusMessage(StatusCodes.OK, res, Messages200.VarcoUpdated);
    } catch (error) {
        // Gestione errore, restituisce un messaggio di errore interno del server
        return MessageGenerator.getStatusMessage(StatusCodes.INTERNAL_SERVER_ERROR, res, Messages500.InternalServerError);
    }
};

// Funzione per cancellare un varco
export const deleteVarco = async (req: Request, res: Response) => {
    try {
        // Cancellazione del varco nel database
        const deleted = await Varco.destroy({
            where: { id: req.params.id }
        });
        // Risposta di successo senza contenuto
        return MessageGenerator.getStatusMessage(StatusCodes.NO_CONTENT, res, Messages204.VarcoDeleted);
    } catch (error) {
        // Gestione errore, restituisce un messaggio di errore interno del server
        return MessageGenerator.getStatusMessage(StatusCodes.INTERNAL_SERVER_ERROR, res, Messages500.InternalServerError);
    }
};
