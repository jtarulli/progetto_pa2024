import { decodeJwt } from '../utils/jwtUtils';
import { Request, Response, NextFunction } from 'express';
import { StatusCodes, Messages400, Messages401 } from '../messages/messaggi';
import { MessageGenerator } from '../messages/messaggiHandler';

/**
 * Middleware per controllare la validità del token JWT nell'intestazione della richiesta.
 * Verifica se il token JWT è presente e se è possibile decodificarlo correttamente.
 * Restituisce un errore 401 se il token JWT è mancante o non valido.
 * 
 * @param req - Oggetto della richiesta HTTP.
 * @param res - Oggetto della risposta HTTP.
 * @param next - Funzione di callback per passare alla prossima operazione.
 */
export const validateJwtToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    try {
        const decodedToken = authHeader ? decodeJwt(authHeader) : null;

        if (decodedToken && decodedToken.email && decodedToken.password) {
            next();
        } else {
            MessageGenerator.getStatusMessage(StatusCodes.UNAUTHORIZED, res, Messages401.UnauthorizedUser);
        }
    } catch (error) {
        MessageGenerator.getStatusMessage(StatusCodes.UNAUTHORIZED, res, Messages401.UnauthorizedUser);
    }
};
