const express = require('express');
const server = require('./server');
const path = require('path');
require('dotenv').config();
const app = express();

app.use('/', server);

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.listen(3000, () => {
  console.info('server démarré');
});
