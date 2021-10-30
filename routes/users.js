const express = require("express");
const router = express.Router();

const UserController = require("../controllers/user.controller");

//update user
router.put("/:id", UserController.updateUser);

//delete user
router.delete("/:id", UserController.deleteUser);

//get user
router.get("/:id", UserController.getUser);

//follow a user
router.put("/:id/follow", UserController.follow);

//unfollow a user
router.put("/:id/unfollow", UserController.unfollow);

router.get("/", UserController.index);

module.exports = router;
