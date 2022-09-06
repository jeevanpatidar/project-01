const blogModel = require("../model/blogModel")
const authorModel = require("../model/authorModel")
const mongoose = require('mongoose')


//=====================Checking the input value is Valid or Invalid=====================//
let checkValid = function (value) {
    if (typeof value == "undefined" || value.length == 0 || typeof value == "number" || typeof value == null) {
        return false
    }
    if (typeof value == "string") {
        return true
    }
    return true
}


//=====================This function is used for Creating a Blog=====================//
const CreateBlog = async function (req, res) {
    try {
        let data = req.body;
        let { title, authorId, category, subcategory, body, tags } = data

        //=====================Checking the validation=====================//
        if (!(title && authorId && category && body))
            return res.status(400).send({ status: false, msg: "Please fill the Mandatory Fields." });


        //=====================Validation of Title=====================//
        if (!checkValid(title))
            return res.status(400).send({ status: false, message: "Please enter Blog Title." });


        //=====================Validation of Blog Body=====================//
        if (!checkValid(body))
            return res.status(400).send({ status: false, message: "Please enter Blog Body." });


        //=====================Validation of Tags=====================//
        if (!checkValid(tags))
            return res.status(400).send({ status: false, message: "Please enter Blog Tags." });


        //=====================Validation of Category=====================//
        if (!checkValid(category))
            return res.status(400).send({ status: false, message: "Please enter Blog Category." });


        //=====================Validation of Subcategory=====================//
        if (!checkValid(subcategory))
            return res.status(400).send({ status: false, message: "Please enter Subcategory of The Blog." })


        //=====================Validation of AuthorId=====================//
        let authorData = await authorModel.findById(authorId);
        if (!authorData) return res.status(404).send({ status: false, msg: "Author not found." });


        //=====================Creation of Blog=====================//
        let createBlog = await blogModel.create(data);
        res.status(201).send({ status: true, data: createBlog });


    } catch (error) {
        res.status(500).send({ error: error.message })
    }
};


//=====================This function used for Fetching a Blog=====================//
const GetDataBlog = async function (req, res) {
    try {
        let data = req.query
        let { authorId, tags, category, subcategory } = data;


        if (Object.keys(data) == 0) {
            let blogData = await blogModel.find({ $and: [{ isDeleted: { $eq: false } }, { isPublished: { $eq: true } }] })
            if (blogData.length == 0) return res.status(404).send({ status: false, msg: "No documents are found" })
            return res.status(200).send(blogData);
        }

        let obj = {}
        let Objectid = mongoose.Types.ObjectId(authorId)
        // let AuthorId = await authorModel.find({authorId: authorId})
        if (!Objectid) {
            return res.status(400).send({ status: false, msg: "Author is Not Valid !" })
        }

        obj.authorId = authorId

        // if (authorId) {
        //     obj.authorId = authorId;
        // }

        if (tags) {
            obj.tags = tags;
        }
        if (category) {
            obj.category = category;
        }
        if (subcategory) {
            obj.subcategory = subcategory
        }

        //=====================Console the Query Data=====================//
        console.log(obj)


        //=====================Get All Blog Data=====================//
        let blog = await blogModel.find(obj)
        if (blog.length == 0) return res.status(404).send({ status: false, msg: "Blog Not Found." })

        res.status(200).send({ status: true, data: blog })


    } catch (error) {
        res.status(500).send({ error: error.message })
    }
};






module.exports = { CreateBlog, GetDataBlog }
