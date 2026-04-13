var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const customerRouter = require("./routes/customer");
var session = require("express-session");

const mongoose = require("mongoose");

mongoose
  // .connect("mongodb://localhost:27017/CustomerDB")
  .connect(
    "tangthientan10194_db_user:70IpON2nGIgfHaSS@cluster0.erd7x8u.mongodb.net/?appName=Cluster0",
  )
  .then(() => console.log("Connect MongoDB Successfully"))
  .catch((err) => console.log("MongoDB Error:", err));

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// setup session
app.use(
  session({
    secret: "my-secret-key-12",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 30 * 60,
      httpOnly: true,
    },
  }),
);

// middleware send session to view
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/customers", customerRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
