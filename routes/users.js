const express = require("express");
const { getUserProfile } = require("../controllers/users");
const router = express.Router();
const { checkAuthentication } = require("../util/auth");

/* GET users listing. */
router.get("/:id", checkAuthentication, getUserProfile);

module.exports = router;
