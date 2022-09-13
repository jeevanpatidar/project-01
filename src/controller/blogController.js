//=====================Importing Module and Packages=====================//
const blogModel = require("../model/blogModel")
const authorModel = require("../model/authorModel")
const moment = require('moment');





//=====================Date of Indian Time Zone=====================//
let DATE = moment().format()


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


        //===================== Checking given AuthorID Whether It is You or Not! =====================//
        if (authorId) {
            if (authorId !== req.token.Payload.UserId) {
                return res.status(403).send({ status: false, message: "You can't create someone else!! Please use your Own AuthorID." });
            }
        }

        //===================== Checking given Published is True or False inside Body. Then publishedAt will Update the Current Date & Time When You Create Blog =====================//
        if (req.body.isPublished == true) {
            req.body.publishedAt = DATE
        }

        //===================== Fetch the data from DB =====================//
        let checkTitle = await blogModel.findOne({ title: title })

        if (!checkTitle) {
            //===================== Creation of Blog =====================//
            let createBlog = await blogModel.create(data);
            return res.status(201).send({ status: true, data: createBlog });
        }

        //===================== Checking given Title Whether that data is already Exist in our DB or Not =====================//
        if (title === checkTitle.title) {
            return res.status(400).send({ status: false, message: "Same Given Title already Exist!! You Should give another Title." });
        }


    } catch (error) {

        res.status(500).send({ error: error.message })
    }
};


//=====================This function used for Fetching a Blog=====================//
const GetDataBlog = async function (req, res) {
    try {

        let data = req.query


        //=====================Get All Blog Data =====================//
        if (Object.keys(data).length == 0) {
            let blogData = await blogModel.find({ $and: [{ isDeleted: { $eq: false } }, { isPublished: { $eq: true } }] }).populate('authorId', { _id: 0, fname: 1, lname: 1, title: 1 }).lean()
            /* lean() : IT CONVERTS BSON FORMAT INTO JAVASCRIPT OBJECT FORMAT.*/


            //===================== This loop is for to Concat AuthorID Values =====================//
            for (let i in blogData) {
                let LastElement = Object.values(blogData[i].authorId)
                blogData[i].authorId = LastElement.pop() + ". " + LastElement.join(" ")
            }

            //===================== Checking length of blogData =====================//
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
        let blog = await blogModel.find(obj).populate('authorId', { _id: 0, fname: 1, lname: 1, title: 1 }).lean()/*.count()*/


        //===================== This loop is for to Concat AuthorID Values =====================//
        for (let i in blog) {
            let LastElement = Object.values(blog[i].authorId)
            blog[i].authorId = LastElement.pop() + ". " + LastElement.join(" ")
        }

        //===================== Checking length of blog =====================//
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


        //===================== Checking Required Field =====================//
        if (!(title || body || tags || subcategory)) {
            return res.status(400).send({ status: false, message: "Mandatory fields are required." });
        }

        //===================== Fetching Data with BlogId and Updating Document =====================//
        let blog = await blogModel.findOneAndUpdate({ _id: BlogId }, {
            $push: { subcategory: subcategory, tags: tags },
            $set: { title: title, body: body, isPublished: true, publishedAt: DATE }
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
        let blogDetails2 = await blogModel.findOneAndUpdate({ _id: BlogId }, { $set: { isDeleted: true, deletedAt: DATE } }, { new: true })

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
        if (!(authorId || tags || category || subcategory || isPublished)) { return res.status(400).send({ status: false, msg: "Please Write authorId or tags or category or subcategory or isPublished." }) }

        //===================== Fetching Data By Query and Delete it =====================//
        let blogDetails = await blogModel.updateMany({ $and: [{ isDeleted: false }, { $or: [{ authorId: authorId }, { tags: tags }, { category: category }, { subcategory: subcategory }, { isPublished: isPublished }] }] },
            { $set: { isDeleted: true, deletedAt: DATE } })

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
