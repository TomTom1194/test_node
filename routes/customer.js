var express = require("express");
var router = express.Router();
const CustomerModel = require("../model/customer.model");

// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }
  res.redirect('/');
}

/* GET home page. */
router.get("/", isAuthenticated, async (req, res) => {
  const customers = await CustomerModel.find();
  res.render("customer/index", { customers });
});

/* GET create form */
router.get("/create", isAuthenticated, (req, res) => {
  res.render("customer/create");
});

/* POST create customer */
router.post("/create", isAuthenticated, async (req, res) => {
  const { name, birthday, gender, email } = req.body;
  const newCustomer = new CustomerModel({
    name,
    birthday: new Date(birthday),
    gender: gender === 'true',
    email,
  });
  await newCustomer.save();
  res.redirect("/customers");
});

/* GET customer detail */
router.get("/detail/:id", isAuthenticated, async (req, res) => {
  const customer = await CustomerModel.findById(req.params.id);
  if (!customer) {
    return res.status(404).send("Customer not found");
  }
  res.render("customer/detail", { customer });
});

/* GET edit form */
router.get("/edit/:id", isAuthenticated, async (req, res) => {
  const customer = await CustomerModel.findById(req.params.id);
  if (!customer) {
    return res.status(404).send("Customer not found");
  }
  res.render("customer/edit", { customer });
});

/* POST update customer */
router.post("/edit/:id", isAuthenticated, async (req, res) => {
  const { name, birthday, gender, email } = req.body;
  await CustomerModel.findByIdAndUpdate(req.params.id, {
    name,
    birthday: new Date(birthday),
    gender: gender === 'true',
    email,
  });
  res.redirect("/customers");
});

/* POST delete customer */
router.post("/delete/:id", isAuthenticated, async (req, res) => {
  await CustomerModel.findByIdAndDelete(req.params.id);
  res.redirect("/customers");
});

module.exports = router;
