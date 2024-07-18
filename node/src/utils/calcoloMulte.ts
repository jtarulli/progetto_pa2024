import { Transito } from '../models/transito';
import { Veicolo } from '../models/veicolo';
import { Varco } from '../models/varco';
import { Multa } from '../models/multa';
import { Whitelist } from '../models/whitelist';
import { Ztl } from '../models/ztl';
import { Op } from 'sequelize';

/**
 * Calcola e memorizza una multa basata sul transito del veicolo.
 * @param transito - Il transito del veicolo per il quale calcolare la multa.
 */
export async function calcolaEMemorizzaMulte(transito: Transito): Promise<void> {
    try {
        // Verifica se il veicolo esiste
        const veicolo = await Veicolo.findOne({ where: { targa: transito.targa_veicolo } });
        if (!veicolo) {
            console.error(`Veicolo non trovato con targa: ${transito.targa_veicolo}`);
            return;
        }

        // Verifica se il transito è un'uscita
        if (transito.ingresso_uscita === 'Uscita') {
            console.log(`Transito in uscita per il veicolo ${transito.targa_veicolo}. Nessuna multa emessa.`);
            return;
        }

        // Controlla se il veicolo è nella whitelist
        const isInWhitelist = await isVeicoloInWhitelist(transito);
        if (isInWhitelist) {
            console.log(`Veicolo ${transito.targa_veicolo} esente da multa in quanto presente nella whitelist.`);
            return;
        }

        // Trova il varco associato al transito, includendo la ZTL associata
        const varco = await Varco.findOne({ where: { id: transito.varco_id }, include: [{ model: Ztl }] });
        if (!varco) {
            console.error(`Varco non trovato con ID: ${transito.varco_id}`);
            return;
        }

        // Verifica se il varco è aperto al momento del transito
        const isVarcoAperto = await varco.isAperto(transito);
        if (isVarcoAperto) {
            // Determina il giorno della settimana e l'ora del transito
            const giornoSettimana = transito.pedaggio.getDay();
            const oraTransito = transito.pedaggio.getHours();

            // Determina la fascia oraria del transito (mattina, pomeriggio, sera, notte, etc.)
            const fasciaOraria = determinaFasciaOraria(oraTransito);

            // Verifica se esiste una tariffa per il tipo di veicolo, giorno e fascia oraria
            const importo = calcolaImportoMulta(veicolo.tipo, giornoSettimana, fasciaOraria);

            if (importo > 0) {
                // Registra la multa nel database
                await Multa.create({
                    transito_id: transito.id,
                    importo: importo,
                    data_emissione: new Date(),
                    targa_veicolo: transito.targa_veicolo,
                    is_pagata: false
                });

                console.log(`Multa registrata per il veicolo ${transito.targa_veicolo} di importo ${importo}€`);
            }
        }
    } catch (error) {
        console.error('Errore durante il calcolo delle multe:', error);
    }
}

/**
 * Verifica se il veicolo è presente nella whitelist al momento del transito.
 * @param transito - Il transito del veicolo per il quale verificare la whitelist.
 * @returns True se il veicolo è nella whitelist, altrimenti False.
 */
async function isVeicoloInWhitelist(transito: Transito): Promise<boolean> {
    const whitelistEntry = await Whitelist.findOne({
        where: {
            targa_veicolo: transito.targa_veicolo,
            inizio_validita: { [Op.lte]: transito.pedaggio },
            fine_validita: { [Op.gte]: transito.pedaggio }
        }
    });

    return whitelistEntry !== null;
}

/**
 * Determina la fascia oraria in base all'ora del transito.
 * @param ora - L'ora del transito (0-23).
 * @returns La fascia oraria del transito.
 */
function determinaFasciaOraria(ora: number): string {
    if (ora >= 8 && ora < 13) {
        return 'mattina';
    } else if (ora >= 13 && ora < 19) {
        return 'pomeriggio';
    } else {
        return 'altro';
    }
}

/**
 * Calcola l'importo della multa in base al tipo di veicolo, giorno della settimana e fascia oraria.
 * @param tipoVeicolo - Il tipo di veicolo (Auto, Moto, Camper, ecc.).
 * @param giornoSettimana - Il giorno della settimana (0 per Domenica, 1 per Lunedì, ecc.).
 * @param fasciaOraria - La fascia oraria del transito (mattina, pomeriggio, sera, notte, etc.).
 * @returns L'importo della multa calcolato.
 */
function calcolaImportoMulta(tipoVeicolo: string, giornoSettimana: number, fasciaOraria: string): number {
    switch (tipoVeicolo) {
        case 'Auto':
            if (giornoSettimana >= 1 && giornoSettimana <= 5) { // Lunedì-Venerdì
                switch (fasciaOraria) {
                    case 'mattina':
                        return 100;
                    case 'pomeriggio':
                        return 150;
                    default:
                        return 0; // Nessuna tariffa specificata per altre fasce orarie
                }
            } else { // Sabato-Domenica
                return 200;
            }
        case 'Moto':
            if (giornoSettimana >= 1 && giornoSettimana <= 5) { // Lunedì-Venerdì
                switch (fasciaOraria) {
                    case 'mattina':
                        return 80;
                    case 'pomeriggio':
                        return 120;
                    default:
                        return 0; // Nessuna tariffa specificata per altre fasce orarie
                }
            } else { // Sabato-Domenica
                return 150;
            }
        case 'Camper':
            if (giornoSettimana >= 1 && giornoSettimana <= 5) { // Lunedì-Venerdì
                switch (fasciaOraria) {
                    case 'mattina':
                        return 150;
                    case 'pomeriggio':
                        return 200;
                    default:
                        return 0; // Nessuna tariffa specificata per altre fasce orarie
                }
            } else { // Sabato-Domenica
                return 250;
            }
        default:
            return 0; // Nessuna tariffa specificata per altri tipi di veicolo
    }
}
