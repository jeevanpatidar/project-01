//=====================Importing Packages=====================//
const mongoose = require('mongoose')

//=====================Storing type of AuthorID=====================//
const ObjectId = mongoose.Schema.Types.ObjectId

//=====================Creating Blog Schema=====================//
const blogSchema = new mongoose.Schema({

    title: { type: String, require: true, trim: true },
    body: { type: String, require: true, trim: true },
    authorId: { type: ObjectId, ref: 'Author', require: true },
    tags: [String],
    category: { type: [String], require: true },
    subcategory: [String],
    deletedAt: { type: Date, default: null },
    isDeleted: { type: Boolean, default: false },
    publishedAt: { type: Date, default: null },
    isPublished: { type: Boolean, default: false }


}, { timestamps: true }
)


//=====================Module Export=====================//
module.exports = mongoose.model('Blog', blogSchema)