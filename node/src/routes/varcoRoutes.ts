import { Router } from 'express';
import { createVarco, getVarchi, getVarcoById, updateVarco, deleteVarco } from '../controllers/varcoController';
import { validateCreateVarco, validateUpdateVarco, checkVarcoExists } from '../middleware/validation/varcoMiddleware';
import bodyParser from 'body-parser';
import { checkRole } from '../middleware/checkRole';

const router = Router();
const jsonParser = bodyParser.json();

// Route per creare un nuovo varco
router.post('/varchi', checkRole(['operatore']), jsonParser, validateCreateVarco, createVarco);

// Route per ottenere tutti i varchi
router.get('/varchi', checkRole(['operatore']), getVarchi);

// Route per ottenere un varco specifico tramite ID
router.get('/varchi/:id', checkRole(['operatore']), checkVarcoExists, getVarcoById);

// Route per aggiornare un varco specifico tramite ID
router.put('/varchi/:id', checkRole(['operatore']), jsonParser, checkVarcoExists, validateUpdateVarco, updateVarco);

// Route per eliminare un varco specifico tramite ID
router.delete('/varchi/:id', checkRole(['operatore']), checkVarcoExists, deleteVarco);

export default router;
