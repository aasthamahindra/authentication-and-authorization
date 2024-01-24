require('dotenv').config()
const mongoose = require('mongoose');

const uri = process.env.MONGO_URI;
const requisite = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

const connection = mongoose.createConnection(uri, requisite);

connection.once('open', () => {
    console.log('MongoDB started.');
}).once('close', () => {
    throw new Error('Failed to Establish Mongodb connections');
});

module.exports = { connection }