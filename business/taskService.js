const { Task } = require('../dataAccess/taskDAO');

const getTasks = async (filter = {}, sortBy = 'priorite', sortOrder = 'ASC') => {
  
  const validSortFields = ['id', 'titre', 'description', 'priorite', 'date_limite', 'statut'];
  if (!validSortFields.includes(sortBy)) {
    throw new Error(`Champ de tri non valide : ${sortBy}`);
  }

  const order = [[sortBy, sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC']];
  // Retourner les résultats en incluant les critères de filtrage et de tri
  return await Task.findAll({
    where: filter,
    order: order
  });
};

const getSortCriteria = (sortBy, sortOrder) => {
  switch (sortBy) {
    case 'priorite':
      return [['priorite', sortOrder]];
    case 'statut':
      return [['statut', sortOrder]];
    case 'date':
      return [['date_limite', sortOrder]];
    default:
      return [['priorite', 'ASC']]; // Tri par priorité par défaut
  }
};

const addTask = async (task) => {
  return await Task.create(task);
};

const updateTask = async (id, updates) => {
  const task = await Task.findByPk(id);
  if (!task) throw new Error('Tâche introuvable');
  return await task.update(updates);
};

const markTaskAsCompleted = async (id) => {
  const task = await Task.findByPk(id);
  if (!task) throw new Error('Tâche introuvable');

  if (task.statut !== 'en cours') {
    throw new Error("Seules les tâches en cours peuvent être marquées comme terminées.");
  }

  return await task.update({ statut: 'terminée' });
};

const updateTaskIfInProgress = async (id, updates) => {
  const task = await Task.findByPk(id);
  if (!task) throw new Error('Tâche introuvable');

  if (task.statut !== 'en cours') {
    throw new Error("Seules les tâches en cours peuvent être modifiées.");
  }

  return await task.update(updates);
};

const deleteTaskIfCompleted = async (id) => {
  const task = await Task.findByPk(id);
  if (!task) throw new Error('Tâche introuvable');

  if (task.statut !== 'terminée') {
    throw new Error("Seules les tâches terminées peuvent être supprimées.");
  }

  await task.destroy();
};

const updateOverdueTasks = async () => {
    const tasks = await Task.findAll();
  
    const currentDate = new Date();
  
    // Vérifie chaque tâche et si la date limite est passée et que la tâche n'est pas déjà terminée
    for (const task of tasks) {
      if (task.date_limite < currentDate && task.statut !== 'terminée' && task.statut !== 'en retard') {
        await task.update({ statut: 'en retard' });
      }
    }
  };

module.exports = {
  getTasks,
  addTask,
  updateTask,
  markTaskAsCompleted,
  updateTaskIfInProgress,
  deleteTaskIfCompleted,
  updateOverdueTasks,
};
