require('dotenv').config()

const express = require('express');
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI);

const app = express();

app.get('/', (req, res) => {
    res.send('Hi');
})

app.listen(3000, () => {
    console.log('Listening on PORT 3000');
})