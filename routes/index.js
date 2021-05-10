const express = require("express");
const router = express.Router();
const { createUser, loginUser, logoutUser } = require("../controllers/index");
const { checkAuthentication, checkNotAuthentication } = require("../util/auth");


const Events = require("../models/events")

/* GET home page. */
router.get("/", async function (req, res, next) {

  try {
    let events = await Events.find({})
  res.render("index", { title: "Home | Syticks",events });

  } catch (error) {
    console.log(error);
  }

});

router.get("/login", checkNotAuthentication, function (req, res, next) {
  res.render("login", { title: "Login | Syticks" });
});

router.post("/login", checkNotAuthentication, loginUser);

router.get("/register", checkNotAuthentication, function (req, res, next) {
  res.render("register", { title: "Register | Syticks" });
});

router.post("/register", checkNotAuthentication, createUser);

router.route("/logout").get(logoutUser);

module.exports = router;
