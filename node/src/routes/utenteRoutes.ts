import { Router } from 'express';
import { login, createUser, getUserTokens, getAllUsers } from '../controllers/utenteController';
import { validateEmail, validatePassword, verifyUserExists, validatePasswordMatch, verifyUserNotRegistered, validateUserJwt } from "../middleware/validation/utenteMiddleware";
import { validateJwtToken } from "../middleware/jwtMiddleware";
import bodyParser from "body-parser";
import { checkRole } from '../middleware/checkRole';

const router = Router();
const jsonParser = bodyParser.json();

// Route per il login dell'utente
router.post('/login', jsonParser, validateEmail, validatePassword, verifyUserExists, validatePasswordMatch, login);

// Route per la registrazione di un nuovo utente
router.post('/register', jsonParser, validateEmail, validatePassword, verifyUserNotRegistered, createUser);

// Route per ottenere i token di un utente (accessibile solo con JWT)
router.get('/user/tokens', validateJwtToken, validateUserJwt, getUserTokens);

// Route per ottenere tutti gli utenti (accessibile solo con JWT)
router.get('/user/all', checkRole(['operatore']), validateJwtToken, getAllUsers);

export default router;
