var express = require("express");
const { check } = require("express-validator");
var cors = require("cors");
var router = express.Router();
var User = require("../models/User");
const customErr = require("../helper/customError");
const authenticationMiddleware = require("../middleware/authenticatio");
const validationMiddlware = require("../middleware/validation");
router.use(express.json());

router.use(cors());

router.get("/", (req, res, next) => {
  User.find()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      next(err);
    });
});
//get user by id
router.get("/getUser/:id", authenticationMiddleware, (req, res, next) => {
  let id = 0;
  if (req.params.id != "undefined") {
    id = req.params.id;
    
   
  } else {
    id = req.user.id;
  }

  User.find({ _id: id })
    .then((data) => {
      res.send(data);
      
    })
    .catch((err) => {
      next(err);
    });
});

//get friends blogs
router.get(
  "/getFriendsBlogs",
  authenticationMiddleware,
  async (req, res, next) => {
    const user = req.user.populate({
      path: "friends",
      populate: { path: "friends" },
    });
    let blogsArr = [];
    if (!user) throw customErr("wrong name or password", 401);
    for (let i = 0; i < user.friends.length; i++) {
      const friend = await User.findOne({ _id: user.friends[i]._id }).populate(
        "blogs"
      );
      blogsArr.push(...friend.blogs);
    }

    res.json({ blogs: blogsArr });
  }
);
//get Friends
router.get("/getFriends", authenticationMiddleware, (req, res, next) => {
  const friends = req.user.friends;
  res.json({ friends: friends });
});
router.post(
  "/register",
  validationMiddlware(
    check("password")
      .isLength({ min: 5 })
      .withMessage("must be at least 5 chars long")
      .matches(/\d/)
      .withMessage("must contain a number")
  ),
  async (req, res, next) => {
    const { name, email, password } = req.body;
    const NewUser = new User({
      name,
      email,
      password,
    });
    await NewUser.save()
      .then(() => {
        res.send({ message: "user was registered successfully" });
        console.log("added");
      })
      .catch((err) => {
        throw customErr(err.message, 422);
      });
  }
);
//edit User friends
router.patch("/", authenticationMiddleware, function (req, res) {
  const { friendId } = req.body;
  console.log(friendId);
  let friends = req.user.friends;
  friends.push(friendId);
  console.log(friends);
  let id = req.user.id;
  User.findByIdAndUpdate(
    { _id: id },
    {
      friends,
    }
  )
    .then((data) => {
      res.send({ msg: "friends was edited successfully", userUpdated: data });
    })
    .catch((err) => {
      res.statusCode = 401;
      res.send("friends is not exist");
    });
});
router.post("/login", async (req, res, next) => {
  // try{
  const { name, email, password } = req.body;

  const userName = await User.findOne({ name: name });
  if (!userName) throw customErr("wrong email or name or password", 401);
  const user = await User.findOne({ email: email });
  if (!user) throw customErr("wrong email or name or password", 401);
  const isMatched = await user.comparePassword(password); //password
  if (!isMatched) throw customErr("wrong email or name or password ", 401);
  const token = await user.generateToken();

  res.json({ user, token });
  // }
  // catch(err){
  //     err.statusCode=422
  //     next(err)

  // }
});

router.delete("/", authenticationMiddleware, function (req, res) {
  const id = req.user.id;
  console.log(id);
  User.findByIdAndDelete({ _id: id }, (err, data) => {})
    .then(() => {
      res.send("deleted successfully");
    })
    .catch((err) => {
      throw customErr("User is not exist", 403);
    });
});

router.patch(
  "/",
  authenticationMiddleware,
  validationMiddlware(
    check("password")
      .isLength({ min: 5 })
      .withMessage("must be at least 5 chars long")
      .matches(/\d/)
      .withMessage("must contain a number")
  ),
  function (req, res) {
    const id = req.user.id;
    const { username, password, firstName, age } = req.body;
    User.findByIdAndUpdate(
      id,
      {
        username,
        password,
        firstName,
        age,
      },
      { new: true, omitUndefined: true, runValidators: true },
      (err, data) => {
        if (err) {
          res.send("User is not exist");
        } else {
          res.send({ msg: "user was edited successfully", userUdated: data });
        }
      }
    );
  }
);
module.exports = router;
