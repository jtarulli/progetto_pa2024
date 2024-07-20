import { StatusCodes } from './messaggi';
import { Response } from "express";

/**
 * Implementazione delle interfacce per la gestione dei messaggi di stato
 * Imposta il messaggio di stato sulla risposta HTTP con il codice di stato corrispondente.
 */

export class BadRequestMessage {
    static setStatus(res: Response, message: string) {
        res.status(StatusCodes.BAD_REQUEST).json({ message });
    }
}

export class UnauthorizedMessage {
    static setStatus(res: Response, message: string) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message });
    }
}

export class CreatedMessage {
    static setStatus(res: Response, message: string) {
        res.status(StatusCodes.CREATED).json({ message });
    }
}

export class NoContentMessage {
    static setStatus(res: Response, message: string) {
        res.status(StatusCodes.NO_CONTENT).json({ message });
    }
}


/**
 * Classe che rappresenta un messaggio di errore interno del server.
 */
export class InternalServerErrorMessage {
    /**
     * Imposta lo stato della risposta e restituisce un oggetto JSON contenente il messaggio di errore.
     * @param res - L'oggetto Response per impostare lo stato e inviare la risposta.
     * @param message - Il messaggio di errore da includere nell'oggetto JSON.
     */
    static setStatus(res: Response, message: string) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message });
    }
}

export class NotFoundErrorMessage {
    static setStatus(res: Response, message: string) {
        res.status(StatusCodes.NOT_FOUND).json({ message });
    }
}

export class OkMessage {
    static setStatus(res: Response, message: string) {
        res.status(StatusCodes.OK).json({ message });
    }
}