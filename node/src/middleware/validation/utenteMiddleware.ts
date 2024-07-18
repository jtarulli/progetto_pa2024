import { Request, Response, NextFunction } from 'express';
import { getUserByEmail } from '../../db/utenteQueries';
import { MessageGenerator } from '../../messages/messaggiHandler';
import { StatusCodes, Messages400, Messages404, Messages401 } from '../../messages/messaggi';
import { extractEmailFromJwt } from '../../utils/jwtUtils';

const isPositiveNumber = (value: any): boolean => !isNaN(value) && value >= 0;
const isValidEmail = (email: string): boolean => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email);


export const validateTokensInRequest = async (req: Request, res: Response, next: NextFunction) => {
    const { tokens } = req.body;
    if (isPositiveNumber(tokens)) {
        next();
    } else {
        MessageGenerator.getStatusMessage(StatusCodes.BAD_REQUEST, res, isNaN(tokens) ? Messages400.NotANumber : Messages400.NegativeTokens);
    }
};

export const validatePassword = (req: Request, res: Response, next: NextFunction) => {
    const { password } = req.body;
    const regex: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/i;

    if (password.length !== 0) {
        if (isNaN(password)) {
            if (regex.test(password)) {
                next();
            } else {
                MessageGenerator.getStatusMessage(StatusCodes.BAD_REQUEST, res, Messages400.PasswordCheck);
            }
        } else {
            MessageGenerator.getStatusMessage(StatusCodes.BAD_REQUEST, res, Messages400.IsANumber);
        }
    } else {
        MessageGenerator.getStatusMessage(StatusCodes.BAD_REQUEST, res, Messages400.PasswordEmpty);
    }
};

export const validatePasswordMatch = async (req: Request, res: Response, next: NextFunction) => {
    const user: any = await getUserByEmail(req.body.email);
    if (user.length !== 0) {
        if (user[0].password === req.body.password) {
            next();
        } else {
            MessageGenerator.getStatusMessage(StatusCodes.BAD_REQUEST, res, Messages400.PasswordNotMatch);
        }
    } else {
        MessageGenerator.getStatusMessage(StatusCodes.BAD_REQUEST, res, Messages404.UserNotFound);
    }
};

export const validateEmail = (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    if (!email) {
        return MessageGenerator.getStatusMessage(StatusCodes.BAD_REQUEST, res, Messages400.EmailEmpty);
    }
    if (isValidEmail(email)) {
        next();
    } else {
        MessageGenerator.getStatusMessage(StatusCodes.BAD_REQUEST, res, Messages400.EmailCheck);
    }
};

export const verifyUserExists = async (req: Request, res: Response, next: NextFunction) => {
    const user: any = await getUserByEmail(req.body.email);
    if (user.length !== 0) {
        next();
    } else {
        MessageGenerator.getStatusMessage(StatusCodes.BAD_REQUEST, res, Messages404.UserNotFound);
    }
};

export const verifyUserNotRegistered = async (req: Request, res: Response, next: NextFunction) => {
    const user: any = await getUserByEmail(req.body.email);
    if (user.length === 0) {
        next();
    } else {
        MessageGenerator.getStatusMessage(StatusCodes.BAD_REQUEST, res, Messages401.UserAlreadyExist);
    }
};

export const validateUserJwt = async (req: Request, res: Response, next: NextFunction) => {
    const jwtEmail = extractEmailFromJwt(req);
    const user: any = await getUserByEmail(jwtEmail);
    if (user.length !== 0) {
        next();
    } else {
        MessageGenerator.getStatusMessage(StatusCodes.BAD_REQUEST, res, Messages404.UserNotFound);
    }
};
