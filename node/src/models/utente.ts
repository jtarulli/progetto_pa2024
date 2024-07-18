import { DataTypes, Model, Optional } from 'sequelize';
import { DbConnector } from '../db/connector';

const sequelize = DbConnector.getConnection();

// Connessione al database
sequelize.authenticate().then(() => {
  console.log('Connessione al database stabilita con successo.');
}).catch((error: any) => {
  console.error('Impossibile connettersi al database: ', error);
});

// Interfaccia per definire le proprietà dell'utente
interface UtenteAttributes {
  id: number;
  nome: string;
  email: string;
  password: string;
  tokens: number;
  ruolo: string;
}

// Interfaccia per definire le proprietà opzionali per la creazione di un utente
interface UtenteCreationAttributes extends Optional<UtenteAttributes, 'id'> {}

// Definizione del modello Utente
export class Utente extends Model<UtenteAttributes, UtenteCreationAttributes> implements UtenteAttributes {
  public id!: number;
  public nome!: string;
  public email!: string;
  public password!: string;
  public tokens!: number;
  public ruolo!: string;
}

// Inizializzazione del modello Utente con le relative colonne e opzioni
Utente.init({
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tokens: {
    type: DataTypes.FLOAT, // Cambiato da FLOAT a DECIMAL per corrispondere alla definizione delle colonne
    allowNull: false,
  },
  ruolo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Utente',
  tableName: 'utenti',
  timestamps: false,
  freezeTableName: true,
  createdAt: false,
  updatedAt: false,
});

// Sincronizzazione del modello con il database
sequelize.sync().then(() => {
  console.log('Tabella Utente creata con successo!');
}).catch((error: any) => {
  console.error('Impossibile creare la tabella: ', error);
});

// Esportazione del modello Utente per l'utilizzo altrove
export default Utente;
