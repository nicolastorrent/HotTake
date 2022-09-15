const express = require('express');
const mongoose = require('mongoose');
// const morgane = require('morgan');//log http
const helmet = require('helmet');
const path = require('path');


const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauces');
const connexionDB = require('./config/connexionDB');




const app = express();

app.use(helmet());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Cross-Origin-Resource-Policy', 'same-site');
    next();
});

app.use(express.json()); //pour lire les information du req.body





app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);
app.use('/api/sauces', sauceRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;