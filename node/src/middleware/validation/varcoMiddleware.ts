import { Request, Response, NextFunction } from 'express';
import { Varco } from '../../models/varco';
import { Ztl } from '../../models/ztl';
import { MessageGenerator } from '../../messages/messaggiHandler';
import { StatusCodes, Messages400, Messages500, Messages404 } from '../../messages/messaggi';

// Funzione per validare il formato dell'orario hh:mm:ss
const isValidTime = (time: string): boolean => {
    const timeFormat = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
    return timeFormat.test(time);
};

// Funzione per confrontare due orari hh:mm:ss
const isEndTimeAfterStartTime = (startTime: string, endTime: string): boolean => {
    return startTime < endTime;
};

// Middleware per validare i dati di creazione di un varco
export const validateCreateVarco = async (req: Request, res: Response, next: NextFunction) => {
    const { nome, ztl_id, orario_apertura, orario_chiusura } = req.body;

    if (!nome || !ztl_id || !orario_apertura || !orario_chiusura) {
        return MessageGenerator.getStatusMessage(StatusCodes.BAD_REQUEST, res, Messages400.CampiMancantiVarco);
    }

    if (!isValidTime(orario_apertura) || !isValidTime(orario_chiusura)) {
        return MessageGenerator.getStatusMessage(StatusCodes.BAD_REQUEST, res, Messages400.OrarioNonValido);
    }

    if (!isEndTimeAfterStartTime(orario_apertura, orario_chiusura)) {
        return MessageGenerator.getStatusMessage(StatusCodes.BAD_REQUEST, res, Messages400.OrarioChiusuraNonValido);
    }

    try {
        const ztl = await Ztl.findByPk(ztl_id);
        if (!ztl) {
            return MessageGenerator.getStatusMessage(StatusCodes.NOT_FOUND, res, Messages404.ZTLNotFound);
        }
    } catch (error) {
        return MessageGenerator.getStatusMessage(StatusCodes.INTERNAL_SERVER_ERROR, res, Messages500.InternalServerError);
    }

    next();
};

// Middleware per validare i dati di aggiornamento di un varco
export const validateUpdateVarco = async (req: Request, res: Response, next: NextFunction) => {
    const { nome, ztl_id, orarioApertura, orarioChiusura } = req.body;

    if (!nome && !ztl_id && !orarioApertura && !orarioChiusura) {
        return MessageGenerator.getStatusMessage(StatusCodes.BAD_REQUEST, res, Messages400.CampiMancantiVarco);
    }

    if ((orarioApertura && !isValidTime(orarioApertura)) || (orarioChiusura && !isValidTime(orarioChiusura))) {
        return MessageGenerator.getStatusMessage(StatusCodes.BAD_REQUEST, res, Messages400.OrarioNonValido);
    }

    if (orarioApertura && orarioChiusura && !isEndTimeAfterStartTime(orarioApertura, orarioChiusura)) {
        return MessageGenerator.getStatusMessage(StatusCodes.BAD_REQUEST, res, Messages400.OrarioChiusuraNonValido);
    }

    if (ztl_id) {
        try {
            const ztl = await Ztl.findByPk(ztl_id);
            if (!ztl) {
                return MessageGenerator.getStatusMessage(StatusCodes.NOT_FOUND, res, Messages404.ZTLNotFound);
            }
        } catch (error) {
            return MessageGenerator.getStatusMessage(StatusCodes.INTERNAL_SERVER_ERROR, res, Messages500.InternalServerError);
        }
    }

    next();
};

// Middleware per verificare l'esistenza di un varco tramite ID
export const checkVarcoExists = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const varco = await Varco.findByPk(req.params.id);
        if (!varco) {
            return MessageGenerator.getStatusMessage(StatusCodes.NOT_FOUND, res, Messages404.VarcoNotFound);
        }
        next();
    } catch (error) {
        return MessageGenerator.getStatusMessage(StatusCodes.INTERNAL_SERVER_ERROR, res, Messages500.InternalServerError);
    }
};
