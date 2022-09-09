//=====================Importing Module and Packages=====================//
const blogModel = require("../model/blogModel")
const authorModel = require("../model/authorModel")



//=====================Checking the input value is Valid or Invalid=====================//
let checkValid = function (value) {
    if (typeof value == "undefined" || typeof value == "number" || typeof value == null) { return false }
    if (typeof value == "string" && value.trim().length == 0) { return false }
    return true
}


//=====================This function is used for Creating a Blog=====================//
const CreateBlog = async function (req, res) {
    try {
        let data = req.body;
        let { title, authorId, category, subcategory, body, tags } = data

        console.log(data)
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
        if (!(/^[a-f\d]{24}$/i).test(authorId)) { return res.status(400).send({ status: false, message: "Please enter Correct AuthorID." }) }
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


        //=====================Get All Blog Data =====================//
        if (Object.keys(data) == 0) {
            let blogData = await blogModel.find({ $and: [{ isDeleted: { $eq: false } }, { isPublished: { $eq: true } }] }).populate('authorId', { _id: 0, email: 0, password: 0, createdAt: 0, updatedAt: 0, __v: 0 })
            if (blogData.length == 0) return res.status(404).send({ status: false, msg: "No documents are found" })
            return res.status(200).send(blogData);
        }

        //===================== Fetching AuthorId from DB =====================//
        let AuthorId = await authorModel.find({ authorId: data.authorId })
        if (!AuthorId) {
            return res.status(400).send({ status: false, msg: "Author is Not Valid !" })
        }

        //==================== Storing Query Data in Empty object =====================//
        let obj = { isDeleted: false, ...data }

        //===================== Get All Blog Data by the help of Query =====================//
        let blog = await blogModel.find(obj).populate('authorId', { _id: 0, email: 0, password: 0, createdAt: 0, updatedAt: 0, __v: 0 })/*.count()*/
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

        //===================== Destructuring Data from Body =====================//
        let { title, body, tags, subcategory } = data

        //===================== Cheking Presence of BlogId =====================//
        if (!BlogId) return res.status(404).send({ status: false, msg: "Please input valid BlogId." });

        //===================== Fetching BlogID from DB =====================//
        let checkBlogID = await blogModel.findOne({ _id: BlogId })
        if (!checkBlogID) return res.status(404).send({ status: false, msg: "Please input valid BlogId." })
        // console.log(checkBlogID)

        //===================== Checking Required Field =====================//
        if (!(title || body || tags || subcategory)) {
            return res.status(400).send({ status: false, message: "Mandatory fields are required." });
        }

        //===================== Fetching Data with BlogId and Updating Document =====================//
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

        if (!BlogId) {
            return res.status(400).send({ status: false, msg: "BlogId is not Defined." })
        }

        //===================== Fetching & Deleting Data From DB =====================//
        let blogDetails2 = await blogModel.findOneAndUpdate({ _id: BlogId }, { $set: { isDeleted: true, deletedAt: Date.now() } }, { new: true })

        res.status(200).send({ status: true, msg: "Blog deleted.", data: blogDetails2 })


    }

    catch (error) {

        res.status(500).send({ msg: error.message })
    }
}


//=====================This function used for Delete Blog=====================//
const DeleteByQuery = async function (req, res) {
    try {
        let data = req.query

        //===================== Destructuring Data from Query =====================//
        let { authorId, tags, category, subcategory, isPublished } = data

        //===================== Checking Required Query =====================//
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Mandatory fields are required." });
        }
        if (!(authorId || tags || category || subcategory || isPublished)) { return res.status(404).send({ status: false, msg: "Please Write authorId or tags or category or subcategory or isPublished." }) }

        //===================== Fetching Data By Query and Delete it =====================//
        let blogDetails = await blogModel.updateMany({ $and: [{ isDeleted: false }, { $or: [{ authorId: authorId }, { tags: tags }, { category: category }, { subcategory: subcategory }, { isPublished: isPublished }] }] },
            { $set: { isDeleted: true, deletedAt: Date.now() } })

        //===================== Checking if Blog is not Present =====================//
        if (blogDetails.modifiedCount == 0 || blogDetails.matchedCount == 0) { return res.status(404).send({ status: false, msg: "Blog is not Present." }) }

        res.status(200).send({ status: true, msg: "Blog deleted.", data: blogDetails })

    }


    catch (error) {

        res.status(500).send({ msg: error.message })
    }
}




//=====================Module Export=====================//
module.exports = { CreateBlog, GetDataBlog, UpdateBlog, DeleteBlog, DeleteByQuery }
