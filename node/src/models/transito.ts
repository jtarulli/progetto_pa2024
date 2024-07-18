import { DataTypes, Model } from 'sequelize';
import { DbConnector } from '../db/connector';
import { Multa } from './multa'; // Importa il modello Multa per l'associazione

const sequelize = DbConnector.getConnection(); // Ottiene l'istanza di Sequelize configurata dal modulo DbConnector

// Autentica la connessione al database
sequelize.authenticate().then(() => {
  console.log('Connessione al database stabilita con successo.');
}).catch((error: any) => {
  console.error('Impossibile connettersi al database: ', error);
});

// Interfaccia che rappresenta gli attributi di un Transito
interface TransitoAttributes {
  id: number;
  targa_veicolo: string;
  pedaggio: Date;
  varco_id: number;
  ingresso_uscita: 'Ingresso' | 'Uscita';
}

// Definizione del modello Transito con Sequelize
export class Transito extends Model<TransitoAttributes> implements TransitoAttributes {
  public id!: number;
  public targa_veicolo!: string;
  public pedaggio!: Date;
  public varco_id!: number;
  public ingresso_uscita!: 'Ingresso' | 'Uscita';
}

// Inizializzazione del modello Transito con i dettagli dei campi del database
Transito.init({
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  targa_veicolo: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  pedaggio: {
    type: DataTypes.DATE,
    allowNull: false
  },
  varco_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  ingresso_uscita: {
    type: DataTypes.ENUM('Ingresso', 'Uscita'),
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Transito', 
  tableName: 'transiti',
  timestamps: false, 
  freezeTableName: true,
  createdAt: false, 
  updatedAt: false, 
});

// Definizione dell'associazione uno-a-uno tra Transito e Multa
Transito.hasOne(Multa, {
  foreignKey: 'transito_id', // Chiave esterna nel modello Multa
  as: 'multa' // Alias dell'associazione
});
Multa.belongsTo(Transito, {
  foreignKey: 'transito_id', // Chiave esterna nel modello Multa
  as: 'transito' // Alias dell'associazione
});

// Sincronizza il modello con il database per creare la tabella, se non esiste già
sequelize.sync().then(() => {
  console.log('Tabella Transiti creata con successo!');
}).catch((error: any) => {
  console.error('Impossibile creare la tabella: ', error);
});
