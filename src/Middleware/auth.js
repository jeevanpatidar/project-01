//=====================Importing Module and Packages=====================//
const JWT = require("jsonwebtoken")
const blogModel = require("../model/blogModel")



//=====================This function used for Authentication(Phase II)=====================//
const Authentication = async function (req, res, next) {
    try {


        //=====================Check Presence of Key with Value in Header=====================//
        let token = req.headers['x-api-key']
        if (!token) { return res.status(400).send({ status: false, msg: "Token must be Present." }) }

        //=====================Verify token & asigning it's value in request body =====================//
        JWT.verify(token, "We-Are-Super-4-From-Plutonium", function (error, decodedToken) {
            if (error) {
                return res.status(401).send({ status: false, msg: "Token is not valid" })
            } else {
                req.token = decodedToken
                console.log(req.token)
                next()
            }
        })

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
        let Query = req.query

        //==================== Check Presence of Query Keys=====================//
        if (Object.keys(Query).length !== 0) {

            //<<<<================================ Authorisation By Queries =====================================>>>>//

            let query = req.query

            //====================fetch query from db =====================//
            const Blog = await blogModel.findOne({ ...query })
            if (!Blog) {
                return res.status(404).send({ status: false, message: `Blog is not found` })

            }
            //==================== Comparing Authorid of DB and Decoded Documents =====================//
            if (Blog.authorId.toString() !== req.token.Payload.UserId) {
                return res.status(400).send({ status: false, message: `Unauthorized access!` });
            }

            return next()
        }


        //<<<<================================ Authorisation By Path Params =====================================>>>>//

        //=================== Fetching Blogid from DB =====================//
        const pBlog = await blogModel.findOne({ _id: BlogId, isDeleted: false })
        if (!pBlog) {
            return res.status(404).send({ status: false, message: `Blog not found` })
        }


        //==================== Comparing Authorid of DB and Decoded Documents =====================//
        if (pBlog.authorId.toString() !== req.token.Payload.UserId) {
            return res.status(400).send({ status: false, message: `Unauthorized access!` });
        }

        next()

    } catch (error) {
        console.log(error)
        res.status(500).send({ msg: error.message })
    }


}



//=====================Module Export=====================//
module.exports = { Authentication, Authorisation }