//=====================Importing Module and Packages=====================//
const authorModel = require("../model/authorModel")
const JWT = require("jsonwebtoken")


//=====================Checking the input value is Valid or Invalid=====================//
let checkValid = function (value) {
    if (typeof value == "undefined" || typeof value == "number" || value.length == 0 || typeof value == null) {
        return false
    } else if (typeof value == "string") {
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
        if (!(fname && lname && title && email && password)) {
            return res.status(400).send({ status: false, msg: "All fields are mandatory." })
        }

        //=====================Validation of First Name=====================//
        if (!checkValid(fname)) return res.status(400).send({ status: false, message: "Please Provide valid Input" })
        if (!(/^[A-Za-z]+$\b/).test(fname)) return res.status(400).send({ status: false, msg: "Please Use Correct Characters in first name" })


        //=====================Validation of Last Name=====================//
        if (!checkValid(lname)) return res.status(400).send({ status: false, message: "Please Provide valid Input" })
        if (!(/^[A-Za-z]+$\b/).test(lname)) return res.send({ status: false, message: "Please Use Correct Characters in Last Name" })


        //=====================Validation of Title=====================//
        if (!(/^(Mr|Mrs|Miss)+$\b/).test(title)) return res.status(400).send({ status: false, msg: "Please Use Valid Title." })


        //=====================Validation of EmailID=====================//
        if (!checkValid(email)) return res.status(400).send({ status: false, message: "Spaces aren't Allowed." })
        if (!(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/).test(email)) { return res.status(400).send({ status: false, msg: "Please provide valid Email" }) }
        let checkDuplicate = await authorModel.findOne({ email: email })
        if (checkDuplicate) { return res.status(400).send({ status: false, msg: "This EmailID already exists please provide another EmailID." }) }


        //=====================Validation of Password=====================//
        if (!(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,32}$/).test(password)) { return res.status(400).send({ status: false, msg: "Your password must be at least 6 characters long, contain at least one number and symbol, and have a mixture of uppercase and lowercase letters." }) }


        //=====================Create Author=====================//
        let createAuthor = await authorModel.create(data)
        res.status(201).send({ status: true, msg: createAuthor })


    } catch (error) {

        res.status(500).send({ error: error.message })
    }
};



//=====================This function used for Author LogIn  (Phase II)=====================//
const AuthorLogin = async function (req, res) {

    try {

        let UserName = req.body.EmailId
        let Password = req.body.Password

        //=====================Checking Mandotory Field=====================//
        if (!(UserName && Password)) { return res.status(400).send("All Fields are Mandotory.") }

        //=====================Checking Format of Email & Password by the help of Regex=====================//
        if (!(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/).test(UserName)) { return res.status(400).send({ status: false, msg: "Please Check EmailID." }) }
        if (!(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,32}$/).test(Password)) { return res.status(400).send({ status: false, msg: "Re-enter your Correct Password." }) }

        //=====================Fetch Data from DB=====================//
        let authorDetail = await authorModel.findOne({ email: UserName, password: Password })
        if (!authorDetail) return res.status(400).send({ status: false, msg: "Wrong UserName or Password." })

        //=====================Token Generation by using JWT=====================//
        let Payload = {
            UserId: authorDetail._id.toString(),
            EmailID: authorDetail.email,
            Password: authorDetail.password,
            Batch: "Plutonium",
            Group: "Room-21",
            Project: "Blogging Site Mini Project"
        }
        let token = JWT.sign({ Payload }, "We-Are-Super-4-From-Plutonium", { expiresIn: "1 days" })

        //=====================Set Key with value in Response Header=====================//
        res.setHeader("x-api-key", token);

        //=====================Send Token in Response Body=====================//
        res.status(200).send({ status: true, token: token });


    } catch (error) {

        res.status(500).send({ error: error.message })
    }

}



//=====================Module Export=====================//
module.exports = { CreateAuthor, AuthorLogin }