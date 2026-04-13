var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../model/user.model");

/* GET login page. */
router.get("/login", (req, res) => {
  res.render("login", { error: null });
});

/* POST login. */
router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.render("login", { error: "Invalid username or password." });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.render("login", { error: "Invalid username or password." });
    }

    req.session.user = { id: user._id, username: user.username };
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

/* GET register page. */
router.get("/register", (req, res) => {
  res.render("register", { error: null });
});

/* POST register. */
router.post("/register", async (req, res, next) => {
  try {
    const { username, password, confirmPassword } = req.body;
    if (!username || !password || !confirmPassword) {
      return res.render("register", { error: "Please fill in all fields." });
    }
    if (password !== confirmPassword) {
      return res.render("register", { error: "Passwords do not match." });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.render("register", { error: "Username already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.redirect("/users/login");
  } catch (err) {
    next(err);
  }
});

/* GET logout. */
router.get("/logout", function (req, res, next) {
  req.session.destroy(function (err) {
    if (err) return next(err);
    res.redirect("/");
  });
});

module.exports = router;
