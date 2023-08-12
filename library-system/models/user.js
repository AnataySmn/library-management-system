const mongoose = require('mongoose');

// Take the out of the box functionality from the plm package to extend the user model
const plm = require('passport-local-mongoose');

var userSchemaDefinition = {
    username: String,
    password: String
}

var userSchema = new mongoose.Schema(userSchemaDefinition);

// Use passport-local-mongoose to indicate this is a special authentication model
userSchema.plugin(plm);

module.exports = new mongoose.model('User', userSchema);