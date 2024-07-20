import { Request, Response, NextFunction } from 'express';
import { StatusCodes, Messages400, Messages500, Messages404 } from '../../messages/messaggi';
import Varco from '../../models/varco';
import { MessageGenerator } from '../../messages/messaggiHandler';

export const validateStatisticheParams = async (req: Request, res: Response, next: NextFunction) => {
    const { varco_id, start_date, end_date, format } = req.query;

    console.log(Number(varco_id));
    const varco = await Varco.findByPk(Number(varco_id));
    if (!varco) {
        return MessageGenerator.getStatusMessage(StatusCodes.NOT_FOUND, res, Messages404.VarcoNotFound);
    }

    // Controllo che varco_id sia presente e sia un numero
    if (!varco_id || isNaN(Number(varco_id))) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: Messages400.MissingOrInvalidVarcoId });
    }

    // Controllo che start_date sia una data valida
    if (!start_date || isNaN(Date.parse(start_date as string))) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: Messages400.InvalidStartDateFormat });
    }

    // Controllo che end_date sia una data valida
    if (!end_date || isNaN(Date.parse(end_date as string))) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: Messages400.InvalidEndDateFormat });
    }

    // Controllo che end_date sia successiva a start_date
    const startDate = new Date(start_date as string);
    const endDate = new Date(end_date as string);
    if (endDate <= startDate) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: Messages400.EndDateNotAfterStartDate });
    }

    // Controllo che il formato sia valido se presente
    if (format && !['json', 'pdf'].includes(format as string)) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: Messages400.InvalidFormatType });
    }

    next();
};
