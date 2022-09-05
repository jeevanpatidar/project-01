const createModel = require("../model/blogModel")
const authorModel = require("../model/authorModel")

const CreateBlog = async function (req, res) {
    try {
        let data = req.body;
        let author = authorModel.findById(data.authorId)
        if (!author) res.status(400).send({ status: false, msg: "Invalid AuthorID" })
        let savedData = await createModel.create(data);
        res.status(201).send({ status: true, data: savedData });
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
};

module.exports = CreateBlog