const express = require("express");
const router = express.Router();
const Post = require("../model/Post");
const User = require("../model/User");

const PostController = require("../controllers/posts.controller");

//create a post
router.get("/", (req, res) => {
  res.json("fsdfsdfsdf");
});

router.post("/", PostController.newPost);
//update a post
router.put("/:id", PostController.updatePost);
//delete a post
router.delete("/:id", PostController.deletePost);
//like a post
router.put("/:id/like", PostController.likePost);
//get a post
router.get("/:id", PostController.getPost);
//get timeline posts
router.get("/timeline/all", PostController.getTimelinePosts);
//comment
router.get("/:id/comment", PostController.comment);
module.exports = router;
