var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/login", (req, res) => {
  return res.render("login");
});

module.exports = router;
