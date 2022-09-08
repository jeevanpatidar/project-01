//=====================Importing Module and Packages=====================//
const mongoose = require('mongoose')

//=====================Creating Author Schema=====================//
const authorSchema = new mongoose.Schema({

    fname: { type: String, require: true },
    lname: { type: String, require: true },
    title: { type: String, emun: ["Mr", "Mrs", "Miss"], require: true },
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true }

}, { timestamps: true }
)


//=====================Module Export=====================//
module.exports = mongoose.model('Author', authorSchema) 