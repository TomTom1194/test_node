const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  name: String,
  birthday: Date,
  gender: Boolean,
  email: String,
});

module.exports = mongoose.model("Customer", customerSchema);
