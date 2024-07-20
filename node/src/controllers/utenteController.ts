import { Request, Response } from "express";
import { extractEmailFromJwt } from '../utils/jwtUtils';
import { addUserToDatabase, retrieveAllUsers, getUserByEmail } from '../db/utenteQueries';
import { MessageGenerator } from '../messages/messaggiHandler';
import { StatusCodes, Messages200, Messages500, Messages201 } from '../messages/messaggi';
var jwt = require('jsonwebtoken');

const PRIVATE_KEY = process.env.PRIVATE_KEY;

// Funzione di login che genera un token JWT
export const login = async (req: Request, res: Response) => {
    const email = req.body.email;
    const password = req.body.password;
    try {
        const payload = {
            email: email,
            password: password,
        };

        // Genera un token JWT con il payload e la chiave privata
        const jwtBearerToken = jwt.sign(payload, PRIVATE_KEY);
        let message = JSON.parse(JSON.stringify({ jwt: jwtBearerToken }));
        // Restituisce il messaggio di successo con il token JWT
        return MessageGenerator.getStatusMessage(StatusCodes.OK, res, message);
    } catch (e) {
        // Gestione errore, restituisce un messaggio di errore interno del server
        return MessageGenerator.getStatusMessage(StatusCodes.INTERNAL_SERVER_ERROR, res, Messages500.InternalServerError);
    }
};

// Funzione per ottenere i token di un utente
export const getUserTokens = async (req: Request, res: Response) => {
    try {
        // Estrae l'email dal token JWT
        let jwtPlayerEmail = extractEmailFromJwt(req);
        // Trova l'utente nel database
        const user: any = await getUserByEmail(jwtPlayerEmail);
        const tokens = parseFloat(user[0].dataValues.tokens);
        let message = JSON.parse(JSON.stringify({ tokens: tokens }))
        // Restituisce il numero di token dell'utente
        return MessageGenerator.getStatusMessage(StatusCodes.OK, res, message);
    } catch (error) {
        // Gestione errore, restituisce un messaggio di errore interno del server
        return MessageGenerator.getStatusMessage(StatusCodes.INTERNAL_SERVER_ERROR, res, Messages500.InternalServerError);
    }
};

// Funzione per creare un nuovo utente
export const createUser = async (req: Request, res: Response) => {
    try {
        // Crea l'utente nel database
        console.log("oppa");
        await addUserToDatabase(req);
        // Restituisce un messaggio di successo
        return MessageGenerator.getStatusMessage(StatusCodes.OK, res, Messages201.UserCreateSuccess);
    } catch (e) {
        console.log(e);
        // Gestione errore, restituisce un messaggio di errore interno del server
        return MessageGenerator.getStatusMessage(StatusCodes.INTERNAL_SERVER_ERROR, res, Messages500.InternalServerError);
    }
};

// Funzione per ottenere tutti gli utenti
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        // Trova tutti gli utenti nel database
        const users: any = await retrieveAllUsers();
        let message = JSON.parse(JSON.stringify({ users: users }));
        // Restituisce tutti gli utenti
        return MessageGenerator.getStatusMessage(StatusCodes.OK, res, message);
    } catch (error) {
        // Gestione errore, restituisce un messaggio di errore interno del server
        return MessageGenerator.getStatusMessage(StatusCodes.INTERNAL_SERVER_ERROR, res, Messages500.InternalServerError);
    }
};
