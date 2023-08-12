const mongoose = require('mongoose');

// Create schema definition object using mapping notation
const booksSchemaDefinition = {
    // add each element and its properties
    name: {
        type: String,
        required: true
    },
    author_name: {
        type: String,
        required: true
    },
    genres: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        default: '200'
    }
};


var booksSchema = new mongoose.Schema(booksSchemaDefinition);
module.exports = mongoose.model('Book', booksSchema);;