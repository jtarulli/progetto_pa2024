import { Router } from 'express';
import { createZtl, getZtls, getZtlById, updateZtl, deleteZtl } from '../controllers/ztlController';
import { checkRole } from '../middleware/checkRole';
import { validateCreateZtl, validateUpdateZtl, checkZtlExists } from '../middleware/validation/ztlMiddleware';
import { decrementTokens } from '../middleware/decrementToken';

const router = Router();

// Route per ottenere tutte le ZTL
router.get('/ztl', decrementTokens, getZtls);

// Route per creare una nuova ZTL
router.post('/ztl', checkRole(['operatore']), validateCreateZtl, decrementTokens, createZtl);

// Route per ottenere una ZTL specifica tramite ID
router.get('/ztl/:id', checkRole(['operatore']), checkZtlExists , decrementTokens, getZtlById);

// Route per aggiornare una ZTL specifica tramite ID
router.put('/ztl/:id', checkRole(['operatore']), validateUpdateZtl , checkZtlExists , decrementTokens, updateZtl);

// Route per eliminare una ZTL specifica tramite ID
router.delete('/ztl/:id', checkRole(['operatore']), checkZtlExists , decrementTokens, deleteZtl);

export default router;
