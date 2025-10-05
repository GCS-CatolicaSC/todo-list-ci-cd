var express = require('express');
var router = express.Router();

let tasks = [];
let nextId = 1;

router.get('/', function (req, res, next) {
  const filter = req.query.filter || 'all';
  let filteredTasks = tasks;

  if (filter === 'active') {
    filteredTasks = tasks.filter(t => !t.completed);
  } else if (filter === 'completed') {
    filteredTasks = tasks.filter(t => t.completed);
  }

  res.render('index', { tasks: filteredTasks, filter });
});

router.post('/tasks', (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.redirect('/');
  }

  const task = {
    id: nextId++,
    text,
    completed: false
  };
  tasks.push(task);

  res.redirect('/');
});

router.post('/tasks/:id/update', (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find(t => t.id === id);
  if (!task) return res.sendStatus(404);

  task.text = req.body.text || task.text;
  res.redirect('/');
});

router.post('/tasks/:id/toggle', (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find(t => t.id === id);
  if (!task) return res.sendStatus(404);

  task.completed = !task.completed;
  res.redirect('/');
});

router.post('/tasks/:id/delete', (req, res) => {
  const id = parseInt(req.params.id);
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) return res.sendStatus(404);

  tasks.splice(index, 1);
  res.redirect('/');
});

module.exports = router;
