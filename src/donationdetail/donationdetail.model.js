'use strict'

const mongoose = require('mongoose');

const detalleDonacionSchema = mongoose.Schema({
    causa: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    }

}, {
    versionKey: false
});

module.exports = mongoose.model('DetalleDonacion', detalleDonacionSchema)