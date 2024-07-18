import { DataTypes, Model } from 'sequelize';
import { DbConnector } from '../db/connector';

const sequelize = DbConnector.getConnection();

// Connessione al database
sequelize.authenticate().then(() => {
  console.log('Connessione al database stabilita con successo.');
}).catch((error: any) => {
  console.error('Impossibile connettersi al database: ', error);
});

// Interfaccia per definire le proprietà della Whitelist
interface WhitelistAttributes {
  id: number;
  targa_veicolo: string;
  inizio_validita: Date;
  fine_validita: Date;
}

// Definizione della classe Whitelist estendendo Model e implementando WhitelistAttributes
export class Whitelist extends Model<WhitelistAttributes> implements WhitelistAttributes {
  public id!: number;
  public targa_veicolo!: string;
  public inizio_validita!: Date;
  public fine_validita!: Date;
}

// Inizializzazione del modello Whitelist con le colonne e le opzioni
Whitelist.init({
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  targa_veicolo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  inizio_validita: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  fine_validita: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Whitelist',
  tableName: 'whitelist',
  timestamps: false,
  freezeTableName: true,
  createdAt: false,
  updatedAt: false,
});

// Sincronizzazione del modello con il database
sequelize.sync().then(() => {
  console.log('Tabella Whitelist creata con successo!');
}).catch((error: any) => {
  console.error('Impossibile creare la tabella: ', error);
});

// Esportazione del modello Whitelist per l'utilizzo altrove
export default Whitelist;
