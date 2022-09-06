
const express = require('express');
const router = express.Router();
const CreateAuthor = require("../controller/authorController")
const { CreateBlog, GetDataBlog } = require("../controller/blogController")




//=====================Create Authors(Post API)=====================//
router.post("/authors", CreateAuthor)
//=====================Create Blogs(Post API)=====================//
router.post("/blogs", CreateBlog)
//=====================Fetch All Blogs Data(Get API)=====================//
router.get("/blogs", GetDataBlog)
//=====================+=====================//


module.exports = router;   