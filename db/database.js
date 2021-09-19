const mongoose = require('mongoose');
const { mongoDB } = require('../config/config');

mongoose.connect(mongoDB.URI, mongoDB.config)
    .then(()=>{console.log('Connected to MongoDB succesfully')})
    .catch(()=>{
        console.log(`Couldn't connect to MongoDB, the app won't work. Make sure that the configs are ok`);
    });