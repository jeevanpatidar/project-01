const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const blogSchema = new mongoose.Schema({

    // { title: {mandatory}, body: {mandatory}, authorId: {mandatory, refs to author model}, tags: {array of string}, category: {string, mandatory, examples: [technology, entertainment, life style, food, fashion]}, 
    // subcategory: {array of string, examples[technology-[web development, mobile development, AI, ML etc]] }, createdAt, updatedAt, deletedAt: {when the document is deleted}, isDeleted: {boolean, default: false}, 
    // publishedAt: {when the blog is published}, isPublished: {boolean, default: false}}

    title: { type: String, require: true },
    body: { type: String, require: true },
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

module.exports = mongoose.model('Blog', blogSchema)