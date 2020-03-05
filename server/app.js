const express = require('express');
const morgan = require('morgan');

const app = express();

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: false }));
// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(morgan('dev'));

const fixture = [
  {
      todoItemId: 0,
      name: 'an item',
      priority: 3,
      completed: false
  },
  {
      todoItemId: 1,
      name: 'another item',
      priority: 2,
      completed: false
  },
  {
      todoItemId: 2,
      name: 'a done item',
      priority: 1,
      completed: true
  }
];

// add your code here
app.get('/', (req, res) => {
  res.statusCode = 200;
  res.json({status: "ok"});
})

app.get('/api/TodoItems', (req, res) => {
  res.send(fixture)
})

app.get('/api/TodoItems/:number', (req, res) => {
  let todoById = fixture.filter((item) => {
    if(item.todoItemId == req.params.number) {
      return item
    }
  });

  res.send(todoById[0])
})

app.post('/api/TodoItems/', (req, res) => {

  const mock = {
    todoItemId: req.body.todoItemId,
    name: req.body.name,
    priority: req.body.priority,
    completed: req.body.completed
  }

  console.log('mock: ', mock)

  for(let i = 0; i < fixture.length; i++) {
    console.log('loop: ', fixture[i].todoItemId, mock.todoItemId)
    if(fixture[i].todoItemId == mock.todoItemId) {
      console.log('EDIT item', i)
      fixture[i] = {...mock}
      res.status(201).send(fixture[i])
      console.log(fixture)
      return
    } else if(i === fixture.length - 1) {
      console.log('NEW item: ', i)
      fixture.push(mock)
      res.status(201).send(fixture[i])
      console.log(fixture)
      return
    }
  }
})

app.delete('/api/TodoItems/:number', (req, res) => {
  let idExists = true
  let deleted;

  let deleteTodo = fixture.filter((todo) => {
    // console.log(`!:${todo.todoItemId}/${typeof todo.todoItemId} !!:${req.params.number}/${typeof req.params.number}`)
    // console.log(todo.todoItemId !== Number(req.params.number))

    if(todo.todoItemId !== Number(req.params.number)) {
      return todo
    } else if(todo.todoItemId === Number(req.params.number)) {
      console.log('deleted: ', todo)
      deleted = todo
    } else {
      console.log('id not found: ', todo.todoItemId)
      idExists = false
    }

    // if(!idExists) {
    //   res.status(400).send('item id does not exist')
    //   idExists = true
    // } else {
    //   res.send(deleteTodo[0])
    // }
  })
  res.send(deleted)
  console.log('now deleted: ', deleteTodo)
})

module.exports = app;
