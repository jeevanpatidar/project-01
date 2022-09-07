const JWT = require("jsonwebtoken")
const blogModel = require("../model/blogModel")
const mongoose = require('mongoose')




//=====================This function used for Authentication(Phase II)=====================//
const Authentication = async function (req, res, next) {
    try {
        let token = req.headers['x-api-key']

        if (!token) { return res.status(400).send({ status: false, msg: "Token must be Present." }) }
        let decodedToken = JWT.verify(token, "We-Are-Super-4-From-Plutonium")

        if (!decodedToken) { return res.status(401).send({ status: false, msg: "Token is Invalid" }) }
        console.log(decodedToken)


        // if (req.body.authorId) {

        //     if (decodedToken.userId == req.body.authorId) {
        //         return next()
        //     } else { return res.status(401).send({ status: false, msg: "Unauthorised!" }) }

        // }

        req.token = decodedToken
        console.log(req.token)

        next()

    }
    catch (error) {
        console.log(error)
        res.status(500).send({ msg: error.message })
    }



}
//=====================This function used for Authorisation(Phase II)=====================//

const Authorisation = async function (req, res, next) {
    try {

        let BlogId = req.params.blogId;
        let decordDetails = req.token.Payload.UserId
        let Query = req.query


        if (Object.keys(Query).length !== 0) {
            let query = req.query
            let decordDetails = req.token.Payload.UserId

            const Blog = await blogModel.findOne({ isDeleted: false, ...query })
            if (!Blog) {
                return res.status(404).send({ status: false, message: `Blog is not found` })

            }

            if (Blog.authorId.toString() !== decordDetails) {
                return res.status(400).send({ status: false, message: `Unauthorized access!` });
            }

            return next()
        }

        const pBlog = await blogModel.findOne({ _id: BlogId, isDeleted: false })
        if (!pBlog) {
            return res.status(404).send({ status: false, message: `Blog not found` })

        }

        if (pBlog.authorId.toString() !== decordDetails) {
            return res.status(400).send({ status: false, message: `Unauthorized access!` });
        }

        next()

    } catch (error) {
        console.log(error)
        res.status(500).send({ msg: error.message })
    }


}

























// try{
//     let decoded =  jwt.verify(token,'functionup-thorium')
//     let userToModify = req.params.userId
//     let userLoggedIn= decoded.userId
//     if(userToModify!=userLoggedIn){
//       return res.send({msg: " UnAuthorized User !"})
//     }else{userId}
//   }





module.exports = { Authentication, Authorisation }