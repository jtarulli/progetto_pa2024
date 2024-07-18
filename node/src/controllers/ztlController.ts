import { Request, Response } from 'express';
import Ztl from '../models/ztl';
import { StatusCodes, Messages200, Messages400, Messages500, Messages201, Messages404, Messages204 } from '../messages/messaggi';
import { MessageGenerator } from '../messages/messaggiHandler';

// Aggiungi una nuova ZTL
export const createZtl = async (req: Request, res: Response) => {
    try {
        const { nome, is_active } = req.body;

        // Crea una nuova ZTL utilizzando i dati ricevuti dalla richiesta
        const ztl = await Ztl.create(req.body);

        // Rispondi con la ZTL appena creata
        return MessageGenerator.getStatusMessage(StatusCodes.CREATED, res, Messages201.ZTLCreationSuccess);
    } catch (error) {
        // Gestione errore, restituisce un messaggio di errore interno del server
        return MessageGenerator.getStatusMessage(StatusCodes.INTERNAL_SERVER_ERROR, res, Messages500.InternalServerError);
    }
};

// Ottieni tutte le ZTL
export const getZtls = async (req: Request, res: Response) => {
    try {
        // Recupera tutte le ZTL presenti nel database
        const ztls = await Ztl.findAll();

        // Rispondi con un array contenente tutte le ZTL trovate
        res.status(StatusCodes.OK).json(ztls);
    } catch (error) {
        // Gestione errore, restituisce un messaggio di errore interno del server
        return MessageGenerator.getStatusMessage(StatusCodes.INTERNAL_SERVER_ERROR, res, Messages500.InternalServerError);
    }
};

// Ottieni una ZTL per ID
export const getZtlById = async (req: Request, res: Response) => {
    try {
        // Recupera una singola ZTL dal database tramite l'ID fornito nei parametri della richiesta
        const ztl = await Ztl.findByPk(req.params.id);

        if (!ztl) {
            // Se la ZTL non è stata trovata, rispondi con un messaggio di errore 404
            return MessageGenerator.getStatusMessage(StatusCodes.NOT_FOUND, res, Messages404.ZTLNotFound);
        }

        // Rispondi con la ZTL trovata
        res.status(StatusCodes.OK).json(ztl);

    } catch (error) {
        // Gestione errore, restituisce un messaggio di errore interno del server
        return MessageGenerator.getStatusMessage(StatusCodes.INTERNAL_SERVER_ERROR, res, Messages500.InternalServerError);
    }
};

// Aggiorna una ZTL per ID
export const updateZtl = async (req: Request, res: Response) => {
    try {
        const { nome, is_active } = req.body;

        // Recupera la ZTL dal database tramite l'ID fornito nei parametri della richiesta
        const ztl = await Ztl.findByPk(req.params.id);

        if (!ztl) {
            // Se la ZTL non è stata trovata, rispondi con un messaggio di errore 404
            return MessageGenerator.getStatusMessage(StatusCodes.NOT_FOUND, res, Messages404.ZTLNotFound);
        }

        // Aggiorna i campi nome e is_active della ZTL con i nuovi valori forniti
        await ztl.update({ nome, is_active });

        // Rispondi con la ZTL aggiornata
        res.status(StatusCodes.OK).json(ztl);

    } catch (error) {
        // Gestione errore, restituisce un messaggio di errore interno del server
        return MessageGenerator.getStatusMessage(StatusCodes.INTERNAL_SERVER_ERROR, res, Messages500.InternalServerError);
    }
};

// Cancella una ZTL per ID
export const deleteZtl = async (req: Request, res: Response) => {
    try {
        // Recupera la ZTL dal database tramite l'ID fornito nei parametri della richiesta
        const ztl = await Ztl.findByPk(req.params.id);

        if (!ztl) {
            // Se la ZTL non è stata trovata, rispondi con un messaggio di errore 404
            return MessageGenerator.getStatusMessage(StatusCodes.NOT_FOUND, res, Messages404.ZTLNotFound);
        }

        // Elimina la ZTL dal database
        await ztl.destroy();

        // Rispondi con un messaggio di successo e status 204 (No Content)
        return MessageGenerator.getStatusMessage(StatusCodes.NO_CONTENT, res, Messages204.ZTLDeletionSuccess);

    } catch (error) {
        // Gestione errore, restituisce un messaggio di errore interno del server
        return MessageGenerator.getStatusMessage(StatusCodes.INTERNAL_SERVER_ERROR, res, Messages500.InternalServerError);
    }
};
