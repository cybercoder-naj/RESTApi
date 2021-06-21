const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Set up express app
const app = express();

// Connect to MongoDb
mongoose.connect('mongodb://localhost/ninjago');
mongoose.Promise = global.Promise;

app.use(express.static('public'));

app.use(bodyParser.json());

// Initialise routes
app.use('/api', require('./routes/api'));

// Error handling middleware
app.use((err, req, res, next) => {
    res.status(422).send({ error: err.message });
});

// Listening for requests
app.listen(process.env.process || 4000, () => {
    console.log('Now listening for requests');
});