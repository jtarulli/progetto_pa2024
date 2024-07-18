import { Router } from 'express';
import { createTransito, getTransiti, getTransitoById, updateTransito, deleteTransito, getTransitiStato } from '../controllers/transitoController';
import bodyParser from 'body-parser';
import { checkRole } from '../middleware/checkRole';
import { validateGetTransitiStatoParams, validateTransito, verifyTransitoExists, verifyVeicoloExists } from '../middleware/validation/transitoMiddleware';
import { decrementTokens } from '../middleware/decrementToken';

const router = Router();
const jsonParser = bodyParser.json();

// Route per creare un transito
router.post('/transiti',  checkRole(['operatore','varco']),  validateTransito, verifyVeicoloExists, jsonParser, decrementTokens, createTransito);

// Route per ottenere tutti i transiti
router.get('/transiti', checkRole(['operatore']), decrementTokens, getTransiti);

// Route per ottenere un transito per ID
router.get('/transiti/:id', checkRole(['operatore']), verifyTransitoExists, decrementTokens, getTransitoById);

// Route per aggiornare un transito
router.put('/transiti/:id', checkRole(['operatore']), verifyTransitoExists, validateTransito, jsonParser, decrementTokens, updateTransito);

// Route per eliminare un transito
router.delete('/transiti/:id', checkRole(['operatore']), verifyTransitoExists, decrementTokens, deleteTransito);

// Route per ottenere i transiti con stato (accessibile agli operatori e agli automobilisti).
// Richiede i key params targhe, startDate, endDate, format
router.get('/transitistato', checkRole(['operatore', 'automobilista']), validateGetTransitiStatoParams, decrementTokens, getTransitiStato);

export default router;
