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

module.exports = router;
