const express = require('express');
const bodyParser = require('body-parser');
const { getTasks, addTask, markTaskAsCompleted, updateTaskIfInProgress, deleteTaskIfCompleted, updateOverdueTasks } = require('./business/taskService');


const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));

// Page principale
app.get('/', async (req, res) => {

  await updateOverdueTasks();

  const { sortBy = 'id', sortOrder = 'ASC' } = req.query; // récupère les paramètres de tri depuis l'URL (GET)
  const tasks = await getTasks({}, sortBy, sortOrder);

  const totalTasks = tasks.length;
  const delayTasks = tasks.filter(task => task.statut === 'en retard').length;
  const completedTasks = tasks.filter(task => task.statut === 'terminée').length;

  res.render('index', { tasks, totalTasks, delayTasks, completedTasks, error: null, sortBy,
    sortOrder });
});


// Formulaire d'ajout de tâche
app.post('/tasks', async (req, res) => {
  const { titre, description, priorite, date_limite } = req.body;
  const currentDate = new Date();
  const taskDate = new Date(date_limite);

  if (taskDate < currentDate) {
    return res.render('index', { error: 'La date limite doit être dans le futur.', tasks: await getTasks() });
  }
  await addTask({ titre, description, priorite, date_limite });
  res.redirect('/');
});

app.get('/tasks/:id/edit', async (req, res) => {
  try {
    const tasks = await getTasks({ id: req.params.id });
    if (!tasks.length) throw new Error('Tâche introuvable');
    res.render('edit', { task: tasks[0] }); // Passer la tâche à la vue `edit.ejs`
  } catch (error) {
    res.status(404).send(error.message);
  }
});

app.post('/tasks/:id/complete', async (req, res) => {
  try {
    await markTaskAsCompleted(req.params.id);
    res.redirect('/');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.post('/tasks/:id/edit', async (req, res) => {
  try {
    const updates = req.body;
    await updateTaskIfInProgress(req.params.id, updates);
    res.redirect('/');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.post('/tasks/:id/delete', async (req, res) => {
  try {
    await deleteTaskIfCompleted(req.params.id);
    res.redirect('/');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.listen(3000, () => {
  console.log('Application démarrée sur http://localhost:3000');
});
