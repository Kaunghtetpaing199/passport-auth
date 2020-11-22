const router = require("express").Router();
const User = require("../models/user");
const passport = require("passport");

//login Page
router.get("/login", (req, res) => {
  res.render("login");
});

//Register Page
router.get("/register", (req, res) => {
  res.render("register");
});

//Register Handle
router.post("/register", async (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  //check request fields
  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Please fill in all fields" });
  }
  //check passwords match
  if (password !== password2) {
    errors.push({ msg: "Passwords do not match" });
  }
  //check pass length
  if (password.length < 6) {
    errors.push({ msg: "Password should be at least 6 characters" });
  }
  if (errors.length > 0) {
    res.render("register", { errors, name, email, password, password2 });
  } else {
    const hasUser = await User.findOne({ email: email });
    if (hasUser) {
      errors.push({ msg: "Email is already registered" });
      res.render("register", { errors, name, email, password, password2 });
    } else {
      const newUser = new User({
        name,
        email,
        password,
      });
      newUser
        .save()
        .then((user) => {
          req.flash("Success_msg", "You are now registered and can log in");
          res.redirect("/users/login");
        })
        .catch((err) => console.log(err));
    }
  }
});

//login handle
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);
});

//logout Handle
router.post("/logout", (req, res) => {
  req.logout();
  req.flash("Success_msg", "You are logged out");
  res.redirect("/users/login");
});

module.exports = router;
