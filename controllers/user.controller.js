const bcrypt = require("bcrypt");
const User = require("../model/User");

class UserController {
  static async index(req, res) {
    try {
      res.status(200).json(["Hello"]);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  static async follow(req, res) {
    if (req.body.userId !== req.params.id) {
      try {
        const user = await User.findById(req.params.id);
        const currentUser = await User.findById(req.body.userId);
        if (!user.followers.includes(req.body.userId)) {
          await user.updateOne({ $push: { followers: req.body.userId } });
          await currentUser.updateOne({ $push: { followings: req.params.id } });
          res.status(200).json("user has been followed");
        } else {
          res.status(403).json("you already follow this user");
        }
      } catch (error) {
        console.error(error);
        res.status(500).json(error);
      }
    } else {
      res.status(403).json("you can not follow yourseft");
    }
  }

  static async unfollow(req, res) {
    if (req.body.userId !== req.params.id) {
      try {
        const user = await User.findById(req.params.id);
        const currentUser = await User.findById(req.body.userId);
        if (user.followers.includes(req.body.userId)) {
          await user.updateOne({ $pull: { followers: req.body.userId } });
          await currentUser.updateOne({ $pull: { followings: req.params.id } });
          res.status(200).json("user has been unfollowed");
        } else {
          res.status(403).json("you dont unfollow this user");
        }
      } catch (error) {
        res.status(500).json(error);
      }
    } else {
      res.status(403).json("you can not follow yourseft");
    }
  }

  static async getUser(req, res) {
    try {
      const user = await User.findById(req.params.id);
      const { password, updateAt, ...other } = user._doc;
      res.status(200).json(other);
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  static async deleteUser(req, res) {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
      try {
        const user = await User.findByIdAndDelete(req.params.id);
        res.status(200).json("Account has been delete");
      } catch (err) {
        return res.status(500).json(err);
      }
    } else {
      return res.status(403).json("You can delete only your account!");
    }
  }

  static async updateUser(req, res) {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
      if (req.body.password) {
        try {
          const salt = await bcrypt.genSalt(10);
          req.body.password = await bcrypt.hash(req.body.password, salt);
        } catch (err) {
          return res.status(500).json(err);
        }
      }
      try {
        const user = await User.findByIdAndUpdate(req.params.id, {
          $set: req.body,
        });
        res.status(200).json("Account has been updated");
      } catch (err) {
        return res.status(500).json(err);
      }
    } else {
      return res.status(403).json("You can update only your account!");
    }
  }
}
module.exports = UserController;
