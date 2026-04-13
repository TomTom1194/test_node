var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  if (req.session && req.session.user) {
    return res.redirect("/customers");
  }
  res.render("login", { error: null });
});

module.exports = router;
