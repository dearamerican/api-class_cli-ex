const PORT = 3000;
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const router = express.Router();
const db = require('./db/database.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
  res.send('Hello World!');
})

require('./routes.js')(app, express, router);

console.log('Server running on port', PORT);


module.exports = app;