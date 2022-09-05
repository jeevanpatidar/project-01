const mongoose = require('mongoose')

const authorSchema = new mongoose.Schema({

    fname: { type: String, require: true },
    lname: { type: String, require: true },
    title: { type: String, emun: ["Mr", "Mrs", "Miss"], require: true },
    email: {
        type: String, require: true, unique: true, validate: {
            validator: function (v) { return /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(v); },
            message: "Please enter a valid email"
        },
    },
    password: { type: String, require: true }

}, { timestamps: true }
)

module.exports = mongoose.model('Author', authorSchema)