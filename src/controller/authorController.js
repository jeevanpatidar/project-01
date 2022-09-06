const authorModel = require("../model/authorModel")


//=====================Checking the input value is Valid or Invalid=====================//
let checkValid = function (value) {
    if (typeof value == "undefined" || value.trim().length == 0 || typeof value == "number" || typeof value == null) {
        return false
    }
    if (typeof value == "string") {
        return true
    }
    return true
}


//=====================This function is used for Creating an Author=====================//
const CreateAuthor = async function (req, res) {
    try {
        let data = req.body;

        //=====================Checking the validation=====================//
        let { fname, lname, title, email, password } = data
        if (!(fname && lname && email && password)) {
            return res.status(400).send({ status: false, msg: "All fields are mandatory." })
        }

        //=====================Validation of First Name=====================//
        if (!checkValid(fname)) return res.status(400).send({ status: false, message: "Please Use Alphabets in first name" })
        // let name = /^[A-Za-z]+$/.test(data.fname.trim())
        if (!(/^[A-Za-z]+$/).test(data.fname.trim())) return res.status(400).send({ status: false, msg: "Please Use Alphabets in first name" })


        //=====================Validation of Last Name=====================//
        if (!checkValid(lname)) return res.status(400).send({ status: false, message: "Please Use Alphabets in last name" })
        if (!(/^[A-Za-z]+$/).test(data.lname)) return res.send({ status: false, message: "Please Use Alphabets in last name" })


        //=====================Validation of Title=====================//
        if (!(/^Mr|Mrs|Miss+$/).test(title)) return res.status(400).send({ status: false, msg: "Please Use Valid Title." })


        //=====================Validation of EmailID=====================//
        if (!checkValid(email)) return res.status(400).send({ status: false, message: "Spaces aren't allowed." })
        if (!(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/).test(email)) { return res.status(400).send({ status: false, msg: "please provide valid email" }) }
        let checkDuplicate = await authorModel.findOne({ email: email })
        if (checkDuplicate) { return res.status(400).send({ status: false, msg: "This EmailID already exists please provide another EmailID." }) }


        //=====================Create Author=====================//
        let createAuthor = await authorModel.create(data)
        res.status(201).send({ status: true, msg: createAuthor })


    } catch (error) {
        res.status(500).send({ error: error.message })
    }
};

module.exports = CreateAuthor