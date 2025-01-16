const { Sequelize } = require('sequelize');

// Configuration de la base de données MySQL
const sequelize = new Sequelize('task_manager', 'root', '', {
  host: 'localhost', // Ou l'adresse IP/URL de ton serveur MySQL
  dialect: 'mysql',
});

sequelize
  .authenticate()
  .then(() => console.log('Connexion à MySQL réussie !'))
  .catch((err) => console.error('Erreur de connexion à MySQL :', err));

module.exports = sequelize;
