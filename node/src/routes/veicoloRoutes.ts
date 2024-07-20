import { Router } from 'express';
import { createVeicolo, getVeicoli, getVeicoloById, deleteVeicolo } from '../controllers/veicoloController';
import bodyParser from 'body-parser';
import { checkRole } from '../middleware/checkRole';

const router = Router();
const jsonParser = bodyParser.json();

// Route per creare un nuovo veicolo
router.post('/veicoli', jsonParser, createVeicolo);

// Route per ottenere tutti i veicoli
router.get('/veicoli',  checkRole(['operatore']), getVeicoli);

// Route per ottenere un veicolo specifico tramite targa
router.get('/veicoli/:targa', getVeicoloById);

// Route per eliminare un veicolo specifico tramite targa
router.delete('/veicoli/:targa',  checkRole(['operatore']), deleteVeicolo);

export default router;
