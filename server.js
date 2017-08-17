const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Person = require('./models.js');

const port = process.env.PORT || 3000;

const app = express();

// error status code constants
const STATUS_SERVER_ERROR = 500;
const STATUS_USER_ERROR = 422;

app.use(bodyParser.json());

app.get('/users', (req, res) => {
  Person.find({}, (err, users) => {
    if(err) {
      res.status(STATUS_SERVER_ERROR);
      res.json({ error: err });
      return;
    }
    res.json(users);
  });
});

app.get('/users/:direction', (req, res) => {
  const { direction } = req.params;
  let order = direction;
  Person.find({})
    .sort({ lastName: direction })
    .exec((err, users) => {
    if(err) {
      res.status(STATUS_SERVER_ERROR);
      res.json({ error: err });
      return;
    }
    res.json(users);
    });
});

app.get('/user-get-friends/:id', (req, res) => {
  const { id } = req.params;
  Person.findById(id)
    .select('friends')
    .exec((err, friends) => {
    if(err) {
      res.status(STATUS_SERVER_ERROR);
      res.json({ error: err });
      return;
    }
    res.json(friends);
  }); 
});

app.put('/users/:id', (req, res) => {
   Person.findByIdAndUpdate(
     req.params.id, 
     req.body, (err, response) => {
      if(err) {
        res.status(STATUS_USER_ERROR) 
        res.json({ error: `Error in updating user with id ${req.params.id}` });
      }
      res.json(response);
   });
});

mongoose.Promise = global.Promise;
const connect = mongoose.connect(
  'mongodb://localhost/people',
  { useMongoClient: true }
);
/* eslint no-console: 0 */
connect.then(() => {
  app.listen(port);
  console.log(`Server Listening on ${port}`);
}, (err) => {
  console.log('\n************************');
  console.log("ERROR: Couldn't connect to MongoDB. Do you have it running?");
  console.log('************************\n');
});
