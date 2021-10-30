const bcrypt = require("bcrypt");
const Post = require("../model/Post");
const User = require("../model/User");

class PostController {
  static async newPost(req, res) {
    const newPost = await Post(req.body);
    try {
      const savePost = await newPost.save();
      res.status(200).json(savePost);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  static async updatePost(req, res) {
    try {
      const post = await Post.findById(req.params.id);
      if (post.useId === req.body.useId) {
        await post.updateOne({ $set: req.body });
        res.status(200).json("the post has been updated");
      } else {
        res.status(403).json("you can update only your post");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  }

  static async deletePost(req, res) {
    try {
      const post = await Post.findById(req.params.id);
      if (post.useId === req.body.useId) {
        await post.deleteOne();
        res.status(200).json("the post has been delete");
      } else {
        res.status(403).json("you can delete only your post");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  }

  static async likePost(req, res) {
    try {
      const post = await Post.findById(req.params.id);
      if (!post.likes.includes(req.body.userId)) {
        await post.updateOne({ $push: { likes: req.body.userId } });
        res.status(200).json("the post has been likes");
      } else {
        await post.updateOne({ $pull: { likes: req.body.userId } });
        res.status(200).json("the post has been dislikes");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  }

  static async getPost(req, res) {
    try {
      const post = await Post.findById(req.params.id);
      res.status(200).json(post);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  static async getTimelinePosts(req, res) {
    try {
      const currentUser = await User.findById(req.body.userId);
      const userPosts = await Post.find({ userId: currentUser._id });
      const friendPosts = await Promise.all(
        currentUser.followings.map((friendId) => {
          return Post.find({ userId: friendId });
        })
      );
      res.json(userPosts.concat(...friendPosts));
    } catch (err) {
      res.status(500).json(err);
    }
  }

  static async comment(req, res) {
    try {
      const post = await Post.findById(req.params.id);
      if (!post.likes.includes(req.body.userId)) {
        await post.updateOne({ $push: { likes: req.body.userId } });
        res.status(200).json("the post has been likes");
      } else {
        await post.updateOne({ $pull: { likes: req.body.userId } });
        res.status(200).json("the post has been dislikes");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  }
}

module.exports = PostController;
