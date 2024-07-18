import { Utente } from '../models/utente';
import { Request } from 'express';

const timestamp: number = Date.now();

/**
 * Cerca un utente nel database utilizzando l'indirizzo email.
 *
 * @param emailAddress - L'indirizzo email dell'utente da cercare nel database.
 * @returns Restituisce i dettagli dell'utente trovato.
 */
export async function getUserByEmail(emailAddress: string): Promise<any> {
    return await Utente.findAll({
        where: {
            email: emailAddress,
        }
    });
}

/**
 * Verifica che la password fornita corrisponda all'email specificata.
 *
 * @param emailAddress - L'indirizzo email dell'utente da cercare nel database.
 * @param userPassword - La password dell'utente da cercare nel database.
 * @returns Restituisce i dettagli dell'utente trovato.
 */
export async function verifyUserPassword(emailAddress: string, userPassword: string): Promise<any> {
    return await Utente.findAll({
        where: {
            email: emailAddress,
            password: userPassword
        }
    });
}

/**
 * Recupera tutti gli utenti presenti nel database.
 *
 * @returns Restituisce tutti gli utenti trovati nel database.
 */
export async function retrieveAllUsers(): Promise<any> {
    return await Utente.findAll();
}

/**
 * Aggiunge un nuovo utente al database utilizzando i dettagli forniti nella richiesta.
 *
 * @param request - La richiesta contenente i dettagli dell'utente da creare.
 * @returns Restituisce l'utente creato.
 */
export async function addUserToDatabase(request: Request): Promise<any> {
    return await Utente.create({
        nome: request.body.nome,
        email: request.body.email,
        password: request.body.password,
        tokens: 100.0,
        ruolo: request.body.ruolo
    });
}

/**
 * Aggiorna il numero di token di un utente specificato.
 *
 * @param userId - L'ID dell'utente di cui aggiornare i token.
 * @param tokenCount - Il nuovo numero di token da assegnare all'utente.
 * @returns Nessun valore di ritorno.
 */
export async function decrementUserTokens(userId: number, tokenCount: number): Promise<void> {
    await Utente.update({ tokens: tokenCount }, {
        where: {
            id: userId
        }
    });
}
