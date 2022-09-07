const express = require('express');
const router = express.Router();
const { CreateAuthor, AuthorLogin } = require("../controller/authorController")
const { CreateBlog, GetDataBlog, UpdateBlog, DeleteBlog, DeleteByQuery } = require("../controller/blogController")
const { Authentication, Authorisation } = require("../Middleware/auth")





//=====================Create Authors(Post API)=====================//
router.post("/authors", CreateAuthor)

//=====================Login Authors(Post API)=====================//
router.post("/login", AuthorLogin)

//=====================Create Blogs(Post API)=====================//
router.post("/blogs", Authentication, CreateBlog)

//=====================Fetch All Blogs Data(Get API)=====================//
router.get("/blogs", Authentication, GetDataBlog)

//=====================Update Blogs Data(Put API)=====================//
router.put("/blogs/:blogId", Authentication, Authorisation, UpdateBlog)

//=====================Delete Blogs Data(Delete API)=====================//
router.delete("/blogs/:blogId", Authentication, Authorisation, DeleteBlog)

//=====================Delete Blog Data By Query Param(Delete API)=====================//
router.delete("/blogs", Authentication, Authorisation, DeleteByQuery)




//=====================Module Export=====================//
module.exports = router;   