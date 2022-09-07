const authorModel = require("../model/authorModel")
const JWT = require("jsonwebtoken")


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



//=====================This function used for LogIn Author (Phase II)=====================//

const AuthorLogin = async function (req, res) {

    try {

        let UserName = req.body.EmailId
        let Password = req.body.Password




        if (!(UserName && Password)) { return res.status(400).send("All Fields are Mandotory.") }

        if (!(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/).test(UserName)) { return res.status(400).send({ status: false, msg: "Write Correct Format." }) }

        // let UserNameDetail = await authorModel.findOne({ email: UserName })
        // if (!UserNameDetail) return res.status(400).send({ status: false, msg: "Invalid Username." })

        // let PasswordDetail = await authorModel.findOne({ password: Password })
        // if (!PasswordDetail) return res.status(400).send({ status: false, msg: "Invalid Password." })

        let authorDetail = await authorModel.findOne({ email: UserName, password: Password })
        if (!authorDetail) return res.status(400).send({ status: false, msg: "Wrong UserName or Password." })


        let Payload = {
            UserId: authorDetail._id.toString(),
            Batch: "Plutonium",
            Group: "Room-21",
            Project: "Blogging Site Mini Project"
        }

        let token = JWT.sign({ Payload }, "We-Are-Super-4-From-Plutonium")

        res.setHeader("x-api-key", token);
        res.status(200).send({ status: true, token: token });


    } catch (error) {
        res.status(500).send({ error: error.message })
    }



}

// Rajesh:
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJQYXlsb2FkIjp7IlVzZXJJZCI6IjYzMTVkZmIwMjA0NzJhYTZjYWYyOTQ4OCIsIkJhdGNoIjoiUGx1dG9uaXVtIiwiR3JvdXAiOiJSb29tLTIxIiwiUHJvamVjdCI6IkJsb2dnaW5nIFNpdGUgTWluaSBQcm9qZWN0In0sImlhdCI6MTY2MjU0OTIwM30.PnRWFeXK6ie8PsHJ9imCpLrfyXTEboyhPuOQWmfq640



module.exports = { CreateAuthor, AuthorLogin }