'use strict'

const mongoose = require('mongoose');

const donacionesSchema = mongoose.Schema({
    date:{
        type: Date,
        required: true
    },
    monto:{
        type: Number,
        required: true
    },
    donante: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    beneficiario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    detalleDonacion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DetalleDonacion',
        required: true
    },

},{
    versionKey: false
});

donacionesSchema.set('toJSON', {
    transform: function(doc, ret, options) {
      ret.date = ret.date.toISOString().slice(0,10); // Transform date to YYYY-MM-DD format
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    }
  });

module.exports = mongoose.model('Donaciones',  donacionesSchema)