# Utilizza l'immagine ufficiale di Node.js come immagine base
FROM node:20-alpine
# Imposta la directory di lavoro nel container
WORKDIR /usr/app
COPY . .
# Installa le dipendenze del progetto
RUN npm install
RUN npx tsc 
# Espone la porta su cui l'applicazione sarà disponibile
EXPOSE 3001
# Comando per avviare l'applicazione
CMD ["node", "./build/src/app.js"]
