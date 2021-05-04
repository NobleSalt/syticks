const express = require("express");
const router = express.Router();

/* GET users listing. */
router.get("/:store_id", function (req, res, next) {
  res.render("organiser-dash", { title: "Events | Syticks" });
});

router.get("/:store_id/detail", function (req, res, next) {
  res.render("organiser-detail", { title: "Register | Syticks" });
});

module.exports = router;
