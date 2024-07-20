import { Router } from 'express';
import { createMulta, getMulte, getMultaById, updateMulta, deleteMulta, downloadMultaPDF, getMultePerAutomobilista } from '../controllers/multaController';
import { checkRole } from '../middleware/checkRole';
import { decrementTokens } from '../middleware/decrementToken';

const router = Router();

// Route per creare una multa
router.post('/multe', checkRole(['operatore', 'varco']), createMulta);

// Route per ottenere tutte le multe (solo per gli operatori)
router.get('/multe', checkRole(['operatore']), getMulte);

// Route per ottenere una singola multa per ID (solo per gli operatori)
router.get('/multe/:id', checkRole(['operatore']), getMultaById);

// Route per aggiornare una multa (solo per gli operatori)
router.put('/multe/:id', checkRole(['operatore']), updateMulta);

// Route per eliminare una multa (solo per gli operatori)
router.delete('/multe/:id', checkRole(['operatore']), deleteMulta);

// Route per scaricare il PDF della multa
router.get('/multe/:id/download', checkRole(['operatore', 'varco', 'automobilista']), decrementTokens, downloadMultaPDF);

// Route per ottenere le multe di un automobilista (solo per gli automobilisti)
router.get('/multeautomobilista', checkRole(['automobilista']), decrementTokens, getMultePerAutomobilista);

export default router;
