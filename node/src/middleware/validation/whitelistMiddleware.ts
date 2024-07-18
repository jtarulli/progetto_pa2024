import { Request, Response, NextFunction } from 'express';
import { Whitelist } from '../../models/whitelist';
import { MessageGenerator} from '../../messages/messaggiHandler';
import { StatusCodes, Messages404 } from '../../messages/messaggi';

export const validateWhitelistExists = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id, targa_veicolo } = req.params;
        let whitelistEntry;

        if (id) {
            whitelistEntry = await Whitelist.findByPk(id);
        } else if (targa_veicolo) {
            whitelistEntry = await Whitelist.findOne({ where: { targa_veicolo } });
        }

        if (!whitelistEntry) {
            return MessageGenerator.getStatusMessage(StatusCodes.NOT_FOUND, res, Messages404.WhitelistNotFound);
        }

        next();
    } catch (error) {
        console.error('Errore nella validazione della whitelist:', error);
        return MessageGenerator.getStatusMessage(StatusCodes.INTERNAL_SERVER_ERROR, res, 'Errore interno del server');
    }
};
