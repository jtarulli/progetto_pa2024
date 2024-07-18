import { DataTypes, Model } from 'sequelize';
import { DbConnector } from '../db/connector';

const sequelize = DbConnector.getConnection();

// Connessione al database
sequelize.authenticate().then(() => {
  console.log('Connessione al database stabilita con successo.');
}).catch((error: any) => {
  console.error('Impossibile connettersi al database: ', error);
});

// Interfaccia per definire le proprietà della Ztl
interface ZtlAttributes {
  id: number;
  nome: string;
  is_active: boolean;
}

// Definizione della classe Ztl estendendo Model e implementando ZtlAttributes
export class Ztl extends Model<ZtlAttributes> implements ZtlAttributes {
  public id!: number;
  public nome!: string;
  public is_active!: boolean;
}

// Inizializzazione del modello Ztl con le colonne e le opzioni
Ztl.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nome: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
}, {
  sequelize,
  modelName: 'Ztl',
  tableName: 'ztl',
  timestamps: false,  
});

// Sincronizzazione del modello con il database
sequelize.sync().then(() => {
  console.log('Tabella Ztl creata con successo!');
}).catch((error: any) => {
  console.error('Impossibile creare la tabella: ', error);
});

// Esportazione del modello Ztl per l'utilizzo altrove
export default Ztl;
