'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');

// Ottiene il nome del file corrente
const basename = path.basename(__filename);

// Imposta l'ambiente di default come 'development' se non specificato
const env = process.env.NODE_ENV || 'development';

// Carica la configurazione del database da config/config.json in base all'ambiente corrente
const config = require(__dirname + '/../config/config.json')[env];

// Crea un oggetto vuoto per memorizzare i modelli
const db = {};

let sequelize;

// **Inizializza Sequelize con la configurazione del database**
const initializeSequelize = () => {
  if (config.use_env_variable) {
    // Se è specificato un env variable per il database, usa quello
    sequelize = new Sequelize(process.env[config.use_env_variable], config);
  } else {
    // Altrimenti, usa username, password e altre opzioni da config
    sequelize = new Sequelize(config.database, config.username, config.password, config);
  }
};

initializeSequelize();

// **Carica i modelli e li aggiunge all'oggetto db**
const loadModels = () => {
  fs
    .readdirSync(__dirname)
    .filter(file => {
      return (
        file.indexOf('.') !== 0 && // Esclude i file che iniziano con '.'
        file !== basename && // Esclude questo file (index.js)
        file.slice(-3) === '.js' && // Include solo i file con estensione .js
        file.indexOf('.test.js') === -1 // Esclude i file di test che hanno '.test.js' nel nome
      );
    })
    .forEach(file => {
      // Carica il modello definito nel file e lo associa a sequelize
      const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
      db[model.name] = model;
    });
};

loadModels();

// **Associa le associazioni tra modelli se definite**
const associateModels = () => {
  Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });
};

associateModels();

// **Esporta l'istanza di sequelize e Sequelize insieme a tutti i modelli caricati**
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
