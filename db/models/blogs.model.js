const mongoose = require('mongoose');
const { connection } = require('../connection/mongodb');

const schema = new mongoose.Schema({ 
    title: String,
    body: String,
    genre: String,
    postImage: String,
});

const blogModel = connection.model('blogs', schema);

module.exports = { blogModel };