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
      //====================authorisation by queries=====================//
        let BlogId = req.params.blogId;
        // let decordDetails = req.token.Payload.UserId
        let Query = req.query

 //==================== check Presence of Query keys=====================//
        if (Object.keys(Query).length !== 0) {
            let query = req.query
            
   //====================fetch query from db =====================//
            const Blog = await blogModel.findOne({ ...query })
            if (!Blog) {
                return res.status(404).send({ status: false, message: `Blog is not found` })

            }
      //====================comparing authorid of db and decoded documents =====================//
            if (Blog.authorId.toString() !== req.token.Payload.UserId) {
                return res.status(400).send({ status: false, message: `Unauthorized access!` });
            }

            return next()
        }
        
        
        //======================authorisation by path params====================//

         //=================== fetching blogid from db =====================//
        const pBlog = await blogModel.findOne({ _id: BlogId, isDeleted: false })
        if (!pBlog) {
            return res.status(404).send({ status: false, message: `Blog not found` })
         }

   
          //====================comaparing authorid of db and decoded documents=====================//
        if (pBlog.authorId.toString() !== req.token.Payload.UserId) {
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