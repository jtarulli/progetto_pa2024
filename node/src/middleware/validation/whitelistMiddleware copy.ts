import { Request, Response, NextFunction } from 'express';
import { Whitelist } from '../../models/whitelist'; // Importa il modello Whitelist per interagire con il database
import { MessageGenerator } from '../../messages/messaggiHandler'; // Importa il generatore di messaggi per risposte HTTP
import { StatusCodes, Messages404 } from '../../messages/messaggi'; // Importa i codici di stato e i messaggi di errore

/**
 * Middleware per validare l'esistenza di un'entrata nella whitelist.
 * Cerca l'entrata nella whitelist in base all'ID o alla targa del veicolo forniti nei parametri della richiesta.
 * Se l'entrata non viene trovata, restituisce un errore 404.
 * Se si verifica un errore durante la ricerca, restituisce un errore 500.
 *
 * @param req - La richiesta HTTP
 * @param res - La risposta HTTP
 * @param next - La funzione per passare al prossimo middleware
 */
export const validateWhitelistExists = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Estrae l'ID e la targa del veicolo dai parametri della richiesta
        const { id, targa_veicolo } = req.params;
        let whitelistEntry;

        // Controlla se l'ID è fornito e cerca l'entrata nella whitelist con quell'ID
        if (id) {
            whitelistEntry = await Whitelist.findByPk(id);
        } 
        // Se l'ID non è fornito, cerca l'entrata nella whitelist con la targa del veicolo
        else if (targa_veicolo) {
            whitelistEntry = await Whitelist.findOne({ where: { targa_veicolo } });
        }

        // Se non viene trovata nessuna entrata nella whitelist, restituisce un errore 404
        if (!whitelistEntry) {
            return MessageGenerator.getStatusMessage(
                StatusCodes.NOT_FOUND, 
                res, 
                Messages404.WhitelistNotFound
            );
        }

        // Se l'entrata è trovata, passa al prossimo middleware
        next();
    } catch (error) {
        // Se si verifica un errore durante la ricerca, stampa l'errore e restituisce un errore 500
        console.error('Errore nella validazione della whitelist:', error);
        return MessageGenerator.getStatusMessage(
            StatusCodes.INTERNAL_SERVER_ERROR, 
            res, 
            'Errore interno del server'
        );
    }
};
