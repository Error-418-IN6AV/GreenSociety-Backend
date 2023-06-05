'use strict'

const mongoose = require('mongoose');

const foroSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }

},

{
    versionKey: false
});

module.exports = mongoose.model('Foro', foroSchema);