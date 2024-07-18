import { DataTypes, Model } from 'sequelize';
import { DbConnector } from '../db/connector';
import { Ztl } from './ztl';
import { Transito } from './transito';

const sequelize = DbConnector.getConnection();

// Connessione al database
sequelize.authenticate().then(() => {
  console.log('Connessione al database stabilita con successo.');
}).catch((error: any) => {
  console.error('Impossibile connettersi al database: ', error);
});

// Interfaccia per definire le proprietà del Varco
interface VarcoAttributes {
  id: number;
  nome: string;
  ztl_id: number;
  orario_apertura: string;
  orario_chiusura: string;
}

// Definizione della classe Varco estendendo Model e implementando VarcoAttributes
export class Varco extends Model<VarcoAttributes> implements VarcoAttributes {
  public id!: number;
  public nome!: string;
  public ztl_id!: number;
  public orario_apertura!: string;
  public orario_chiusura!: string;

  // Metodo per verificare se il varco è aperto in base all'orario di transito
  public async isAperto(transito: Transito): Promise<boolean> {
    const oraApertura = new Date(`1970-01-01T${this.orario_apertura}Z`);
    const oraChiusura = new Date(`1970-01-01T${this.orario_chiusura}Z`);
    const oraTransito = new Date(`1970-01-01T${transito.pedaggio.toTimeString().split(' ')[0]}Z`);
    
    return oraTransito >= oraApertura && oraTransito <= oraChiusura;
  }
}

// Inizializzazione del modello Varco con le colonne e le opzioni
Varco.init({
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
  ztl_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Ztl,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  orario_apertura: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  orario_chiusura: {
    type: DataTypes.TIME,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Varco',
  tableName: 'varchi',
  timestamps: false,
  freezeTableName: true,
  createdAt: false,
  updatedAt: false,
});

// Definizione delle associazioni tra Ztl e Varco
Ztl.hasMany(Varco, { foreignKey: 'ztl_id' });
Varco.belongsTo(Ztl, { foreignKey: 'ztl_id' });

// Sincronizzazione del modello con il database
sequelize.sync().then(() => {
  console.log('Tabella Varco creata con successo!');
}).catch((error: any) => {
  console.error('Impossibile creare la tabella: ', error);
});

// Esportazione del modello Varco per l'utilizzo altrove
export default Varco;
