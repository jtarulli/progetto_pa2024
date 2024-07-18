import { Request, Response } from 'express';
import { Transito } from '../models/transito';
import { calcolaEMemorizzaMulte } from '../utils/calcoloMulte';
import { Veicolo } from '../models/veicolo';
import { Multa } from '../models/multa';
import { Op } from 'sequelize';
import { generatePDF } from '../utils/pdfGenerator';
import { getUserByEmail } from '../db/utenteQueries';
import { decodeJwt } from '../utils/jwtUtils';
import { MessageGenerator } from '../messages/messaggiHandler';
import { StatusCodes, Messages500, Messages201, Messages404, Messages204, Messages401, Messages400 } from '../messages/messaggi';

// Funzione per creare un nuovo transito
export const createTransito = async (req: Request, res: Response) => {
    try {
        // Crea il transito
        const transito = await Transito.create(req.body);

        // Chiama la funzione per calcolare la multa e crea la multa se necessario
        await calcolaEMemorizzaMulte(transito);

        return MessageGenerator.getStatusMessage(StatusCodes.CREATED, res, Messages201.ZTLCreationSuccess);
    } catch (error) {
        return MessageGenerator.getStatusMessage(StatusCodes.BAD_REQUEST, res, Messages500.InternalServerError);
    }
};

// Funzione per recuperare tutti i transiti
export const getTransiti = async (req: Request, res: Response) => {
    try {
        const transiti = await Transito.findAll(); // Recupera tutti i transiti dal database
        res.status(200).json(transiti); // Risponde con i transiti recuperati e status 200
    } catch (error) {
        return MessageGenerator.getStatusMessage(StatusCodes.BAD_REQUEST, res, Messages500.InternalServerError);
    }
};

// Funzione per recuperare un transito tramite ID
export const getTransitoById = async (req: Request, res: Response) => {
    try {
        const transito = await Transito.findByPk(req.params.id); // Recupera il transito tramite ID
        if (transito) {
            res.status(200).json(transito); // Risponde con il transito trovato e status 200
        } else {
            return MessageGenerator.getStatusMessage(StatusCodes.NOT_FOUND, res, Messages404.TransitNotFound);
        }
    } catch (error) {
        return MessageGenerator.getStatusMessage(StatusCodes.BAD_REQUEST, res, Messages500.InternalServerError);
    }
};

// Funzione per aggiornare un transito esistente
export const updateTransito = async (req: Request, res: Response) => {
    try {
        const [updated] = await Transito.update(req.body, {
            where: { id: req.params.id }
        }); // Aggiorna il transito nel database
        if (updated) {
            const updatedTransito = await Transito.findByPk(req.params.id); // Recupera il transito aggiornato
            res.status(200).json(updatedTransito); // Risponde con il transito aggiornato e status 200
        } else {
            return MessageGenerator.getStatusMessage(StatusCodes.NOT_FOUND, res, Messages404.TransitNotFound);
        }
    } catch (error) {
        return MessageGenerator.getStatusMessage(StatusCodes.BAD_REQUEST, res, Messages500.InternalServerError);
    }
};

// Funzione per eliminare un transito
export const deleteTransito = async (req: Request, res: Response) => {
    try {
        const deleted = await Transito.destroy({
            where: { id: req.params.id }
        }); // Elimina il transito nel database
        if (deleted) {
            return MessageGenerator.getStatusMessage(StatusCodes.NO_CONTENT, res, Messages204.TransitDeleted);
        } else {
            return MessageGenerator.getStatusMessage(StatusCodes.NOT_FOUND, res, Messages404.TransitNotFound);
        }
    } catch (error) {
        return MessageGenerator.getStatusMessage(StatusCodes.BAD_REQUEST, res, Messages500.InternalServerError);
    }
};

// Funzione per recuperare i transiti con filtri su targhe, date e formato
export const getTransitiStato = async (req: Request, res: Response) => {
    const { targhe, startDate, endDate, format } = req.query; // Recupera i parametri di query
    const jwtBearerToken = req.headers.authorization; // Recupera il token JWT dall'header di autorizzazione
    const jwtDecode = jwtBearerToken ? decodeJwt(jwtBearerToken) : null; // Decodifica il token JWT

    if (!jwtDecode) {
        return MessageGenerator.getStatusMessage(StatusCodes.UNAUTHORIZED, res, Messages401.UnauthorizedUser);
    }

    if (!targhe || !startDate || !endDate) {
        return MessageGenerator.getStatusMessage(StatusCodes.BAD_REQUEST, res, Messages400.TransitMissingParams);
    }

    const targheArray = Array.isArray(targhe) ? targhe : [targhe]; // Converte targhe in array se non lo è

    try {
        const user = await getUserByEmail(jwtDecode.email); // Recupera l'utente tramite email decodificata
        if (!user.length) {
            return MessageGenerator.getStatusMessage(StatusCodes.NOT_FOUND, res, Messages404.UserNotFound);
        }

        // Condizioni di ricerca per i transiti
        let whereCondition: any = {
            targa_veicolo: {
                [Op.in]: targheArray
            },
            pedaggio: {
                [Op.between]: [new Date(startDate as string), new Date(endDate as string)]
            }
        };

        // Se l'utente è un automobilista, filtra i transiti dei suoi veicoli
        if (user[0].dataValues.ruolo === 'automobilista') {
            const userVeicoli = await Veicolo.findAll({ where: { proprietario_id: user[0].dataValues.id } });
            const userTarghe = userVeicoli.map(v => v.targa);
            whereCondition.targa_veicolo = {
                [Op.in]: userTarghe.filter(t => targheArray.includes(t))
            };
        }

        // Recupera i transiti che soddisfano le condizioni di ricerca
        const transiti = await Transito.findAll({
            where: whereCondition,
            include: [
                { model: Multa, as: 'multa' },
                { model: Veicolo, as: 'veicolo' }
            ]
        });

        // Se il formato richiesto è PDF, genera il PDF
        if (format === 'pdf') {
            const pdfBuffer = await generatePDF(transiti);
            res.setHeader('Content-Type', 'application/pdf');
            res.send(pdfBuffer); // Risponde con il PDF generato
        } else {
            res.json(transiti); // Risponde con i transiti in formato JSON
        }
    } catch (error) {
        return MessageGenerator.getStatusMessage(StatusCodes.INTERNAL_SERVER_ERROR, res, Messages500.InternalServerError);
    }
};
