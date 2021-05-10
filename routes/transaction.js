const express = require("express");
const router = express.Router();
const { checkAuthentication } = require("../util/auth");
const { makePayment, verifyPayment } = require("../controllers/transactions");

/* GET users listing. */
router.post("/:slug", checkAuthentication, makePayment);

router.get("/confirm", checkAuthentication, async (req, res) => {
  res.render("confirm", data);
});

router.get("/verify", verifyPayment);

module.exports = router;
