const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const Task = sequelize.define('Task', {
  titre: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  priorite: { type: DataTypes.STRING, allowNull: false },
  date_limite: { type: DataTypes.DATE, allowNull: false },
  statut: { type: DataTypes.STRING, defaultValue: 'en cours' },
});

// Synchronise la base et crée la table si elle n'existe pas
sequelize.sync();

module.exports = { Task };
