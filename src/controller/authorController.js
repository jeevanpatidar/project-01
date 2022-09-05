const authorModel = require("../model/authorModel")

const CreateAuthor = async function (req, res) {
    try {
        let data = req.body;
        let savedData = await authorModel.create(data);
        res.status(201).send({ msg: savedData });
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
};

module.exports = CreateAuthor