import { Router } from 'express';
import { getStatistiche } from '../utils/statistiche';
import { checkRole } from '../middleware/checkRole';
import { decrementTokens } from '../middleware/decrementToken';
import { validateStatisticheParams } from '../middleware/validation/statisticheMiddleware';


const router = Router();

// Route per ottenere le statistiche
// Richiede i key params varco_id, start_date, end_date, format
router.get('/statistiche', checkRole(['operatore']), validateStatisticheParams, decrementTokens, getStatistiche);

export default router;
