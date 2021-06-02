process.env.NODE_ENV !== "production" ? require("dotenv").config() : null;

const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const session = require("express-session");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const eventsRouter = require("./routes/events");
const adminRouter = require("./routes/admin");
const organisersRouter = require("./routes/organisers");
const transactionRouter = require("./routes/transaction");
const aboutRouter = require("./routes/about");

let app = express();

// setup mongoose - database

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true
};

mongoose
  .connect(process.env.DATABASE_URL, options)
  .then(() => console.log("MongoDB Connected..."))
  .catch(err => console.log(err));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(session({ secret: "secret", resave: false, saveUninitialized: false }));
require("./config/passport.config")(app);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// setup static folders
app.use(express.static(path.join(__dirname, "public")));
app.use("/css", express.static(path.join(__dirname, "/public/css")));
app.use("/js", express.static(path.join(__dirname, "/public/js")));
app.use("/img", express.static(path.join(__dirname, "/public/images")));

// Setup routes
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/events", eventsRouter);
app.use("/admin", adminRouter);
app.use("/organiser", organisersRouter);
app.use("/transaction", transactionRouter);
app.use("/about", transactionRouter);

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
