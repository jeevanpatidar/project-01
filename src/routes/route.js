const express = require('express');
const router = express.Router();
const CreateAuthor = require("../controller/authorController")
const { CreateBlog, GetDataBlog, UpdateBlog, DeleteBlog, DeleteByQuery } = require("../controller/blogController")




//=====================Create Authors(Post API)=====================//
router.post("/authors", CreateAuthor)

//=====================Create Blogs(Post API)=====================//
router.post("/blogs", CreateBlog)

//=====================Fetch All Blogs Data(Get API)=====================//
router.get("/blogs", GetDataBlog)

//=====================Update Blogs Data(Put API)=====================//
router.put("/blogs/:blogId", UpdateBlog)

//=====================Delete Blogs Data(Delete API)=====================//
router.delete("/blogs/:blogId", DeleteBlog)

//=====================Delete Blog Data By Query Param(Delete API)=====================//
router.delete("/blogs", DeleteByQuery)




//=====================Module Export=====================//
module.exports = router;   