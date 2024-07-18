import { DataTypes, Model, Optional } from 'sequelize';
import { DbConnector } from '../db/connector';

// Ottiene l'istanza di Sequelize configurata dal modulo DbConnector
const sequelize = DbConnector.getConnection();

// Autentica la connessione al database
sequelize.authenticate().then(() => {
  console.log('Connessione al database stabilita con successo.');
}).catch((error: any) => {
  console.error('Impossibile connettersi al database: ', error);
});

// Interfaccia che rappresenta gli attributi di una Multa
interface MultaAttributes {
  id: number;
  transito_id: number;
  importo: number;
  data_emissione: Date;
  targa_veicolo: string;
  is_pagata: boolean;
}

// Interfaccia per la creazione di una nuova Multa, con l'id opzionale
interface MultaCreationAttributes extends Optional<MultaAttributes, 'id'> {}

// Definizione della classe Modello Multa che estende Model e implementa MultaAttributes
export class Multa extends Model<MultaAttributes, MultaCreationAttributes> implements MultaAttributes {
  public id!: number;
  public transito_id!: number;
  public importo!: number;
  public data_emissione!: Date;
  public targa_veicolo!: string;
  public is_pagata!: boolean;
}

// Inizializzazione del modello Multa con i dettagli dei campi del database
Multa.init({
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  transito_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  importo: {
    type: DataTypes.DECIMAL,
    allowNull: false,
  },
  data_emissione: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  targa_veicolo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  is_pagata: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Multa', 
  tableName: 'multe', 
  timestamps: false, 
  freezeTableName: true, 
  createdAt: false, 
  updatedAt: false, 
});

// Sincronizza il modello con il database per creare la tabella, se non esiste già
sequelize.sync().then(() => {
  console.log('Tabella Multe creata con successo!');
}).catch((error: any) => {
  console.error('Impossibile creare la tabella: ', error);
});
