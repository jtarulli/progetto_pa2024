import { Request, Response, NextFunction } from 'express';
import { Transito } from '../../models/transito';
import { Veicolo } from '../../models/veicolo';
import { StatusCodes, Messages400, Messages404 } from '../../messages/messaggi';

// Middleware per la validazione dei dati di un transito
export const validateTransito = (req: Request, res: Response, next: NextFunction) => {
    const { targa_veicolo, pedaggio, varco_id, ingresso_uscita } = req.body;

    if (!targa_veicolo || !pedaggio || !varco_id || !ingresso_uscita) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: Messages400.TransitMissingParams });
    }

    if (typeof targa_veicolo !== 'string' || typeof varco_id !== 'number' || !['Ingresso', 'Uscita'].includes(ingresso_uscita)) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: Messages400.InvalidTransitType });
    }

    next();
};

// Middleware per verificare l'esistenza di un transito
export const verifyTransitoExists = async (req: Request, res: Response, next: NextFunction) => {
    const transito = await Transito.findByPk(req.params.id);
    if (!transito) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: Messages404.TransitNotFound });
    }
    next();
};

// Middleware per la verifica del veicolo associato
export const verifyVeicoloExists = async (req: Request, res: Response, next: NextFunction) => {
    const { targa_veicolo } = req.body;
    const veicolo = await Veicolo.findOne({ where: { targa: targa_veicolo } });
    if (!veicolo) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: Messages404.VehicleNotFound });
    }
    next();
};

export const validateGetTransitiStatoParams = (req: Request, res: Response, next: NextFunction) => {
    const { targhe, startDate, endDate, format } = req.query;

    if (!targhe || !startDate || !endDate) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: Messages400.GetTransitMissingParams });
    }

    if (!Array.isArray(targhe) && typeof targhe !== 'string') {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: Messages400.InvalidTargheFormat });
    }

    if (isNaN(Date.parse(startDate as string)) || isNaN(Date.parse(endDate as string))) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: Messages400.InvalidDateFormat });
    }

    if (format && !['json', 'pdf'].includes(format as string)) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: Messages400.InvalidFormatType });
    }

    next();
};