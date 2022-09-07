const blogModel = require("../model/blogModel")
const authorModel = require("../model/authorModel")
const mongoose = require('mongoose')
const JWT = require("jsonwebtoken")


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
        // let { authorId } = data;


        //=====================Get All Blog Data =====================//
        if (Object.keys(data) == 0) {
            let blogData = await blogModel.find({ $and: [{ isDeleted: { $eq: false } }, { isPublished: { $eq: true } }] })
            if (blogData.length == 0) return res.status(404).send({ status: false, msg: "No documents are found" })
            return res.status(200).send(blogData);
        }


        // let Objectid = mongoose.Types.ObjectId(authorId)
        let AuthorId = await authorModel.find({ authorId: data.authorId })
        if (!AuthorId) {
            return res.status(400).send({ status: false, msg: "Author is Not Valid !" })
        }

        // if (!checkValid(authorId)) {
        //     return res.status(400).send({ status: false, message: "Please enter AuthorId." });
        // } else { obj.authorId = authorId }

        let obj = { isDeleted: false, ...data }
        // if (authorId) {obj.authorId = authorId;}
        // if (tags) { obj.tags = tags; }
        // if (category) { obj.category = category; }
        // if (subcategory) { obj.subcategory = subcategory }

        //=====================Console the Query Data=====================//
        console.log(obj)


        //=====================Get All Blog Data by the help of Query=====================//
        let blog = await blogModel.find(obj)
        if (blog.length == 0) return res.status(404).send({ status: false, msg: "Blog Not Found." })



        res.status(200).send({ status: true, data: blog })


    } catch (error) {
        res.status(500).send({ error: error.message })
    }
};


//=====================This function used for Update Blog=====================//
const UpdateBlog = async function (req, res) {
    try {

        let data = req.body
        let BlogId = req.params.blogId
        // let blogId = mongoose.Types.ObjectId(BlogId)
        let { title, body, tags, subcategory } = data

        let checkBlogID = await blogModel.findOne({ _id: BlogId })
        if (!checkBlogID) return res.status(404).send({ status: false, msg: "Please input valid BlogId." })
        console.log(checkBlogID)
        // let obj = {}
        // if (BlogId) {
        if (!BlogId) return res.status(404).send({ status: false, msg: "Please input valid BlogId." });
        // else obj.blogId = BlogId;

        // else {
        //     return res.status(404).send({ status: false, msg: "Please put BlogId." })
        // }

        if (!(title || body || tags || subcategory)) {
            return res.status(400).send({ status: false, message: "Mandatory fields are required." });
        }


        let blog = await blogModel.findOneAndUpdate({ _id: BlogId }, {
            $push: { subcategory: subcategory, tags: tags },
            $set: { title: title, body: body, isPublished: true, publishedAt: Date.now() }
        }, { new: true })
        if (!blog) return res.status(404).send({ status: false, msg: "Blog not found." })


        res.status(200).send({ status: true, msg: "Successfully Updated ", data: blog })


    } catch (error) {
        res.status(500).send({ error: error.message })
    }

}



//=====================This function used for Delete Blog=====================//
const DeleteBlog = async function (req, res) {
    try {
        let BlogId = req.params.blogId
        if (!checkValid(BlogId)) {
            return res.status(400).send({ status: false, msg: "BlogId is not Defined." })
        }

        let blogDetails = await blogModel.findOne({ _id: BlogId, isDeleted: false })
        if (!blogDetails) {
            return res.status(404).send({ status: false, msg: "Details are not exist." })
        } else {

            let blogDetails2 = await blogModel.findOneAndUpdate({ _id: BlogId }, { $set: { isDeleted: true, deletedAt: Date.now() } }, { new: true })

            res.status(200).send({ status: true, msg: "Blog deleted.", data: blogDetails2 })
            console.log(blogDetails)
        }
    }


    catch (error) {
        console.log(error)
        res.status(500).send({ msg: error.message })
    }
}



//=====================This function used for Delete Blog=====================//
const DeleteByQuery = async function (req, res) {
    try {
        let data = req.query
        let { authorId, tags, category, subcategory, isPublished } = data


        // if (!(authorId || tags || category || subcategory || isPublished)) {
        //     return res.status(400).send({ status: false, message: "Mandatory fields are required." });
        // }

        if (Object.keys(req.query).length == 0) {
            return res.status(400).send({ status: false, message: "Mandatory fields are required." });
        }


        let blogDetails = await blogModel.updateMany({ $and: [{ isDeleted: false }, { $or: [{ authorId: authorId }, { tags: tags }, { category: category }, { subcategory: subcategory }, { isPublished: isPublished }] }] },
            { $set: { isDeleted: true, deletedAt: Date.now() } })


        res.status(200).send({ status: true, msg: "Blog deleted.", data: blogDetails })

    }


    catch (error) {
        console.log(error)
        res.status(500).send({ msg: error.message })
    }
}








//=====================Module Export=====================//
module.exports = { CreateBlog, GetDataBlog, UpdateBlog, DeleteBlog, DeleteByQuery }
