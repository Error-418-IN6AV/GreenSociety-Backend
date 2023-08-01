'use strict'

const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
    name: String,
    description: String,
    date: String,
    typeevent: String,
});

module.exports = mongoose.model('Event', eventSchema);