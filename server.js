const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const { User, Post } = require('./models.js');

const STATUS_USER_ERROR = 422;
const STATUS_SERVER_ERROR = 500;
const server = express();

server.use(bodyParser.json());

server.post('/users', (req, res) => {
  const { userName} = req.body;
  if (!userName) {
    res.status(422);
    res.json({ error: 'Missing user name' });
    return;
  }
  const user = new User({ userName });
  user.save((err) => {
    if (err) throw err;
    res.json(user);
  });
});

server.get('/users', (req, res) => {
  User.find({}, (err, data) => {
    if (err) throw err;
    res.json(data);
  });
});

server.get('/users/:id', (req, res) => {
  const { id } = req.params;
  User.findById(id, (err, user) => {
    if (err) {
      throw err;
    }
    res.json(user);
  });
});

server.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  User.findByIdAndRemove(id, (err, user) => {
    if (err) {
      throw err;
    }
    res.json(user);
  });
});

server.put('/users/:id', (req, res) => {
  const { name } = req.body;
  const { id } = req.params;
  User.findByIdAndUpdate(id, {"name": name }, () => {
    User.findById(id)
    .exec((err, userUpdated) => {
      if (err) {
        res.status(422);
        res.json({'Error updating user': err.message});
        return;
      }
      res.json(userUpdated);
    });
  });
});

mongoose.Promise = global.Promise;
const connect = mongoose.connect(
  'mongodb://localhost/users',
  { useMongoClient: true }
);

connect.then(() => {
  const port = 3000;
  server.listen(port);
  console.log(`Server Listening on ${port}`);
}, (err) => {
  console.log('\n************************');
  console.log("ERROR: Couldn't connect to MongoDB. Do you have it running?");
  console.log('************************\n');
});