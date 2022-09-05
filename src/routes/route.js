
const express = require('express');
const router = express.Router();
const CreateAuthor = require("../controller/authorController")
const CreateBlog = require("../controller/blogController")




// =====================================================================================================
router.post("/authors", CreateAuthor)
// =====================================================================================================
router.post("/blogs", CreateBlog)
// =====================================================================================================


// router.post("/login", userController.loginUser)
// // =====================================================================================================
// //The userId is sent by front end
// router.get("/users/:userId", authenticate, authorise, userController.getUserData)
// // =====================================================================================================
// router.put("/users/:userId", authenticate, authorise, userController.updateUser)
// // =====================================================================================================
// router.delete("/users/:userId", authenticate, authorise, userController.deleteUser)
// =====================================================================================================
module.exports = router;   