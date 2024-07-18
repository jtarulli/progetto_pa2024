import { Request, Response, NextFunction } from "express";
import { decodeJwt } from "../utils/jwtUtils";
import { getUserByEmail } from "../db/utenteQueries";
import { MessageGenerator } from "../messages/messaggiHandler";
import { StatusCodes, Messages400, Messages500, Messages401 } from "../messages/messaggi";

/**
 * Middleware per verificare il ruolo dell'utente.
 * Controlla se l'utente autenticato nell'autorizzazione JWT ha uno dei ruoli specificati.
 * Restituisce un errore 401 se l'utente non è autorizzato o un errore 500 se si verifica un errore interno.
 *
 * @param roles - Array di ruoli consentiti per accedere alla risorsa.
 * @returns Middleware per Express che verifica il ruolo dell'utente.
 */
export const checkRole = (roles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Estrae il token JWT dall'header di autorizzazione
            const jwtBearerToken = req.headers.authorization;
            
            // Decodifica il token JWT per ottenere le informazioni dell'utente
            const jwtDecode = jwtBearerToken ? decodeJwt(jwtBearerToken) : null;

            // Verifica se il token JWT è stato decodificato correttamente
            if (jwtDecode) {
                // Recupera le informazioni dell'utente dal database basandosi sull'email nel payload JWT
                const user = await getUserByEmail(jwtDecode.email);

                // Verifica se l'utente esiste e ha uno dei ruoli consentiti
                if (user.length > 0 && roles.includes(user[0].dataValues.ruolo)) {
                    // Se l'utente ha uno dei ruoli consentiti, procedi al prossimo middleware o al gestore della route
                    next();
                } else {
                    // Se l'utente non ha uno dei ruoli consentiti, restituisci 401 Unauthorized
                    return MessageGenerator.getStatusMessage(StatusCodes.UNAUTHORIZED, res, Messages401.UnauthorizedUser);
                }
            } else {
                // Se il token JWT non può essere decodificato o è mancante, restituisci 401 Unauthorized
                return MessageGenerator.getStatusMessage(StatusCodes.UNAUTHORIZED, res, Messages401.UnauthorizedUser);
            }
        } catch (error) {
            // Gestisci eventuali errori interni del server e restituisci 500 Internal Server Error
            console.error("Errore nel middleware checkRole:", error);
            return MessageGenerator.getStatusMessage(StatusCodes.INTERNAL_SERVER_ERROR, res, Messages500.InternalServerError);
        }
    };
};
