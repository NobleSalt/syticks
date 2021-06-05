const express = require("express");
const router = express.Router();
const { checkAuthentication } = require("../util/auth");
const {
  makePayment,
  verifyPayment,
  greet
} = require("../controllers/transactions");

/* GET users listing. */
router.post("/:slug", checkAuthentication, makePayment);

router.get("/confirm/:link", checkAuthentication, async (req, res) => {
  const { link } = req.params;
  let data = {
    title: "Confirm Payment | Syticks",
    link
  };
  res.render("confirm", data);
});

router.get("/verify", verifyPayment);

router.get("/transaction/complete/:tx_ref", greet);

module.exports = router;
