const express = require("express");
const router = express.Router();

const { getOneEvent, getAll } = require("../controllers/events");

/* GET users listing. */
router.get("/", getAll);

router.get("/:slug", getOneEvent);

module.exports = router;
