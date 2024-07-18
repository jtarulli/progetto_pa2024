import { DataTypes, Model } from 'sequelize';
import { DbConnector } from '../db/connector';
import { Utente } from './utente'; // Assumendo che Utente sia già definito
import { Transito } from './transito'; // Assumendo che Transito sia già definito

const sequelize = DbConnector.getConnection();

// Connessione al database
sequelize.authenticate().then(() => {
  console.log('Connessione al database stabilita con successo.');
}).catch((error: any) => {
  console.error('Impossibile connettersi al database: ', error);
});

// Interfaccia per definire le proprietà del Veicolo
interface VeicoloAttributes {
  targa: string;
  tipo: string;
  proprietario_id: number;
}

// Definizione della classe Veicolo estendendo Model e implementando VeicoloAttributes
export class Veicolo extends Model<VeicoloAttributes> implements VeicoloAttributes {
  public targa!: string;
  public tipo!: string;
  public proprietario_id!: number;
}

// Inizializzazione del modello Veicolo con le colonne e le opzioni
Veicolo.init({
  targa: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  tipo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  proprietario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Utente,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
}, {
  sequelize,
  modelName: 'Veicolo',
  tableName: 'veicoli',
  timestamps: false,
  freezeTableName: true,
  createdAt: false,
  updatedAt: false,
});

// Definizione delle associazioni tra Utente e Veicolo
Utente.hasMany(Veicolo, { foreignKey: 'proprietario_id' });
Veicolo.belongsTo(Utente, { foreignKey: 'proprietario_id' });

// Definizione delle associazioni tra Veicolo e Transito
Veicolo.hasMany(Transito, { foreignKey: 'targa_veicolo', as: 'transiti' });
Transito.belongsTo(Veicolo, { foreignKey: 'targa_veicolo', as: 'veicolo' });

// Sincronizzazione del modello con il database
sequelize.sync().then(() => {
  console.log('Tabella Veicolo creata con successo!');
}).catch((error: any) => {
  console.error('Impossibile creare la tabella: ', error);
});

// Esportazione del modello Veicolo per l'utilizzo altrove
export default Veicolo;
