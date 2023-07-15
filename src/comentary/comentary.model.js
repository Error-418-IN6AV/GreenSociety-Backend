'use strict'

const mongoose = require('mongoose');

const comentarySchema = mongoose.Schema({
    fecha:{
        type:Date,
        default:Date.now()
    },
    description: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
      },
    name:{
        type: String,
    },
    foro: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Foro',
        required: true 
    },
    like:{
        type:Number,
        default:0
    },
    dislike:{
        type:Number,
        default:0
    }

},

{
    versionKey: false
});

module.exports = mongoose.model('Comment', comentarySchema);