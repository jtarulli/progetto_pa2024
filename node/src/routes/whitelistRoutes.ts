import { Router } from 'express';
import { createWhitelist, getAllWhitelists, getWhitelistByTarga, updateWhitelist, deleteWhitelist } from '../controllers/whitelistController';
import { checkRole } from '../middleware/checkRole'; 
import { validateWhitelistExists } from '../middleware/validation/whitelistMiddleware';

const router = Router();

// Route per creare una nuova whitelist
router.post('/whitelist', checkRole(['operatore']), createWhitelist);

// Route per ottenere tutte le voci della whitelist
router.get('/whitelist', checkRole(['operatore', 'varco', 'automobilista']), getAllWhitelists);

// Route per ottenere una voce della whitelist specifica tramite targa veicolo
router.get('/whitelist/:targa_veicolo', checkRole(['operatore', 'varco', 'automobilista']), validateWhitelistExists, getWhitelistByTarga);

// Route per aggiornare una voce della whitelist specifica tramite ID
router.put('/whitelist/:id', checkRole(['operatore']), validateWhitelistExists, updateWhitelist);

// Route per eliminare una voce della whitelist specifica tramite ID
router.delete('/whitelist/:id', checkRole(['operatore']), validateWhitelistExists, deleteWhitelist);

export default router;
