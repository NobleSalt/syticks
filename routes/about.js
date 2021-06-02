const express = require("express");
const router = express.Router();

/* GET users listing. */

router.get("/", async (req, res) => {
  let data = {
    title: "About Us | Syticks"
  };
  res.render("about", data);
});

module.exports = router;
