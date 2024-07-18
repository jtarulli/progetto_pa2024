import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { Transito } from '../models/transito';
import { Multa } from '../models/multa';
import PDFDocument from 'pdfkit';

/**
 * Ottiene le statistiche relative ai transiti e alle multe per un determinato varco e periodo.
 * Supporta il formato PDF per il download dei dati statistici.
 * @param req - Oggetto della richiesta HTTP.
 * @param res - Oggetto della risposta HTTP.
 */
const getStatistiche = async (req: Request, res: Response) => {
    const { varco_id, start_date, end_date, format } = req.query;

    try {
        const whereClause: any = {
            varco_id: varco_id as string,
        };

        // Aggiungi il filtro per data se specificato
        if (start_date && end_date) {
            whereClause.pedaggio = {
                [Op.between]: [new Date(start_date as string), new Date(end_date as string)]
            };
        }

        // Trova tutti i transiti per il varco e il periodo specificato
        const transiti = await Transito.findAll({ where: whereClause });

        // Estrai gli ID dei transiti trovati
        const transitoIds = transiti.map(transito => transito.get('id'));

        // Calcola numero di violazioni
        const violazioniTotali = await Multa.count({
            where: {
                transito_id: {
                    [Op.in]: transitoIds
                }
            }
        });

        // Calcola l'importo totale delle multe
        const importoTotaleMulte = await Multa.sum('importo', {
            where: {
                transito_id: {
                    [Op.in]: transitoIds
                }
            }
        });

        // Crea l'oggetto con le statistiche
        const statistiche = {
            varco_id,
            transitiTotali: transiti.length,
            violazioniTotali,
            importoTotaleMulte: importoTotaleMulte || 0,
            rapportoViolazioniTransiti: transiti.length > 0 ? violazioniTotali / transiti.length : 0
        };

        // Se il formato richiesto è PDF, genera il documento PDF e lo invia come risposta
        if (format === 'pdf') {
            const doc = new PDFDocument();
            res.setHeader('Content-disposition', 'attachment; filename=statistiche.pdf');
            res.setHeader('Content-type', 'application/pdf');
            doc.text(`Statistiche per il varco ${varco_id}`);
            doc.text(`Transiti totali: ${statistiche.transitiTotali}`);
            doc.text(`Violazioni totali: ${statistiche.violazioniTotali}`);
            doc.text(`Importo totale delle multe: ${statistiche.importoTotaleMulte}€`);
            doc.text(`Rapporto violazioni/transiti: ${statistiche.rapportoViolazioniTransiti}`);
            doc.pipe(res); // Piping del documento PDF alla risposta HTTP
            doc.end(); // Conclusione della creazione del documento PDF
        } else {
            res.json(statistiche); // Risposta JSON con le statistiche
        }
    } catch (error) {
        res.status(500).json({ message: 'Errore nel calcolo delle statistiche', error });
    }
};

export { getStatistiche };
