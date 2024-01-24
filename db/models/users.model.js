const mongoose = require('mongoose');
const { connection } = require('../connection/mongodb');

const schema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    role: String,
});

const userModel = connection.model('users', schema);

module.exports = { userModel };