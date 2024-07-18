import { Request, Response, NextFunction } from 'express';
import Ztl from '../../models/ztl';
import { MessageGenerator } from '../../messages/messaggiHandler';
import { StatusCodes, Messages400, Messages500, Messages404 } from '../../messages/messaggi';

// Funzione per validare i dati di creazione di una ZTL
export const validateCreateZtl = (req: Request, res: Response, next: NextFunction) => {
    const { nome, is_active } = req.body;

    if (!nome || is_active === undefined) {
        return MessageGenerator.getStatusMessage(StatusCodes.BAD_REQUEST, res, Messages400.CampiMancantiZtl);
    }

    next();
};

// Funzione per validare i dati di aggiornamento di una ZTL
export const validateUpdateZtl = (req: Request, res: Response, next: NextFunction) => {
    const { nome, is_active } = req.body;

    if (!nome && is_active === undefined) {
        return MessageGenerator.getStatusMessage(StatusCodes.BAD_REQUEST, res, Messages400.CampiMancantiZtl);
    }

    next();
};

// Middleware per verificare l'esistenza di una ZTL tramite ID
export const checkZtlExists = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const ztl = await Ztl.findByPk(req.params.id);
        if (!ztl) {
            return MessageGenerator.getStatusMessage(StatusCodes.NOT_FOUND, res, Messages404.ZTLNotFound);
        }
        next();
    } catch (error) {
        return MessageGenerator.getStatusMessage(StatusCodes.INTERNAL_SERVER_ERROR, res, Messages500.InternalServerError);
    }
};
