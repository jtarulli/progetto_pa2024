import { Request, Response, NextFunction } from 'express';
import { Multa } from '../../models/multa';
import { MessageGenerator} from '../../messages/messaggiHandler';
import { StatusCodes, Messages404 } from '../../messages/messaggi';

export const validateMultaExists = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const multa = await Multa.findByPk(id);

        if (!multa) {
            return MessageGenerator.getStatusMessage(StatusCodes.NOT_FOUND, res, Messages404.MultaNotFound);
        }

        next();
    } catch (error) {
        return MessageGenerator.getStatusMessage(StatusCodes.INTERNAL_SERVER_ERROR, res, 'Errore interno del server');
    }
};
