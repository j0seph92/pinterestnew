var express = require("express");
var router = express.Router();

const userModel = require("./users");
const postModel = require("./post");

const passport = require("passport");
const localStrategy = require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));

const upload = require("./multer");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index");
});

// register page
router.get("/register", function (req, res, next) {
  res.render("register");
});

// Login page
router.get("/login", function (req, res, next) {
  res.render("login");
});

//logout code
router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) return next(err);
    res.redirect("/");
  });
});

// Add Post page
router.get("/add", isLoggedIn, async function (req, res, next) {
  const user = await userModel.findOne({ username: req.session.passport.user });
  res.render("add", { nav: true });
});

// Create Post page
router.post(
  "/createpost",
  isLoggedIn,
  upload.single("pinImage"),
  async function (req, res, next) {
    const user = await userModel.findOne({
      username: req.session.passport.user,
    });
    const post = await postModel.create({
      user: user._id,
      pinTitle: req.body.pinTitle,
      pinDescription: req.body.pinDescription,
      pinImage: req.file.filename,
    });
    user.posts.push(post._id);
    await user.save();
    res.redirect("/profile");
  }
);

// profile page
router.get("/profile", isLoggedIn, async function (req, res) {
  const user = await userModel
    .findOne({
      username: req.session.passport.user,
    })
    .populate("posts");
  // console.log(user);
  res.render("profile", { user, nav: true });
});

// feed page
router.get("/feeds", isLoggedIn, async function (req, res, next) {
  const user = await userModel.findOne({
    username: req.session.passport.user,
  });
  // const posts = await postModel.find().populate("user").limit(3);
  const posts = await postModel.find().populate("user");
  res.render("feeds", { user, posts, nav: true });
});

// register form route
router.post("/register", function (req, res) {
  const { username, email, contact } = req.body;
  const userData = new userModel({ username, email, contact });

  userModel.register(userData, req.body.password).then(function () {
    passport.authenticate("local")(req, res, function () {
      res.redirect("/profile");
    });
  });
});

// login code
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: true,
  }),
  function (req, res) {}
);

// profile upload
router.post(
  "/fileupload",
  isLoggedIn,
  upload.single("image"),
  async function (req, res, next) {
    // res.send("upload");
    const user = await userModel.findOne({
      username: req.session.passport.user,
    });
    user.profileImage = req.file.filename;
    await user.save();
    res.redirect("/profile");
  }
);

// isLoggedIn Middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}

module.exports = router;
