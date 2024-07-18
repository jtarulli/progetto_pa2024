import express, { NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import userRoutes from './routes/utenteRoutes';
import veicoloRoutes from './routes/veicoloRoutes';
import ztlRoutes from './routes/ztlRoutes';
import varcoRoutes from './routes/varcoRoutes'; 
import transitoRoutes from './routes/transitoRoutes'; 
import multaRoutes from './routes/multaRoutes'; 
import whitelistRoutes from './routes/whitelistRoutes';
import statisticheRoutes from './routes/statisticheRoutes';

dotenv.config();
const app = express();
const port = parseInt(process.env.PORT || '3001', 10); // Converte la porta in numero
const host = process.env.HOST || 'localhost'; // Default a 'localhost' se HOST non è definito

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware per il parsing del JSON
app.use(express.json());

// Gestione degli errori di parsing JSON
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof SyntaxError && 'body' in err) {
        console.error('Errore di parsing JSON!');
        return res.status(400).send({ message: 'JSON malformato!' });
    }
    next(err);
});

// Rotte Utente
app.use('/api', userRoutes);

// Rotte Veicolo
app.use('/api', veicoloRoutes);

// Rotte ZTL
app.use('/api', ztlRoutes);

// Rotte Varco
app.use('/api', varcoRoutes); 

// Rotte Transito
app.use('/api', transitoRoutes); 

// Rotte Multa
app.use('/api', multaRoutes); 

// Rotte Whitelist
app.use('/api', whitelistRoutes); 

// Rotte Statistiche
app.use('/api', statisticheRoutes);

// Home
app.get("/", (req: Request, res: Response) => {
  res.send("Effettua il login per usare l'applicazione");
});

// Avvio del server
app.listen(port, host, () => {
  console.log(`Server in ascolto su http://localhost:${port}`);
});
