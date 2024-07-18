import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';

/**
 * Genera un PDF contenente i dettagli di una multa, inclusi QR code per il pagamento.
 * @param multa - Oggetto contenente i dettagli della multa da includere nel PDF.
 * @returns Una Promise che risolve con i dati del PDF in formato Buffer.
 */
export const generateMultaPDF = async (multa: any): Promise<Buffer> => {
    return new Promise<Buffer>(async (resolve, reject) => {
        try {
            const doc = new PDFDocument();
            const buffers: Buffer[] = [];

            // Gestisce l'evento di dati e fine del documento
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                const pdfData = Buffer.concat(buffers);
                resolve(pdfData);
            });

            // Aggiunge titolo e dettagli della multa al documento
            doc.fontSize(20).text(`Bollettino di Pagamento`, { align: 'center' });
            doc.moveDown();
            doc.fontSize(14).text(`Targa: ${multa.targa_veicolo}`);
            doc.text(`Importo: €${multa.importo}`);
            doc.moveDown();

            // Genera QR code con i dettagli della multa
            const qrString = `${multa.id}|${multa.targa_veicolo}|${multa.importo}`;
            const qrCodeDataURL = await QRCode.toDataURL(qrString);
            const qrCodeImage = qrCodeDataURL.replace(/^data:image\/png;base64,/, "");

            // Inserisce l'immagine QR code nel documento PDF
            doc.image(Buffer.from(qrCodeImage, 'base64'), {
                fit: [100, 100],
                align: 'center',
                valign: 'center'
            });

            // Completa il documento PDF
            doc.end();
        } catch (error) {
            reject(error);
        }
    });
};

/**
 * Genera un PDF contenente lo stato dei transiti forniti.
 * @param transiti - Array di oggetti che rappresentano i transiti da includere nel PDF.
 * @returns Una Promise che risolve con i dati del PDF in formato Buffer.
 */
export const generatePDF = async (transiti: any[]): Promise<Buffer> => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument();
            let buffers: Buffer[] = [];

            // Gestisce l'evento di dati e fine del documento
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {});

            // Aggiunge titolo al documento
            doc.fontSize(12).text('Stato dei Transiti', { align: 'center' });

            // Itera attraverso i transiti e aggiunge i dettagli al documento
            transiti.forEach(transito => {
                doc.text(`Targa: ${transito.targa_veicolo}`);
                doc.text(`Varco: ${transito.varco_id}`);
                doc.text(`Tipologia veicolo: ${transito.veicolo.tipo}`);
                if (transito.multa) {
                    doc.text(`Multa: ${transito.multa.importo}€`);
                }
                doc.moveDown();
            });

            // Completa il documento PDF
            doc.end();

            // Gestisce l'evento di fine per risolvere la Promise con i dati del PDF
            doc.on('end', () => {
                const pdfData = Buffer.concat(buffers);
                resolve(pdfData);
            });
        } catch (error) {
            reject(error);
        }
    });
};
