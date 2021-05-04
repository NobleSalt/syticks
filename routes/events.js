const express = require("express");
const router = express.Router();

const Events = require("../models/events");

/* GET users listing. */
router.get("/", async function (req, res, next) {
  try {
    let events = await Events.find({});

    let data = {
      title: "Events | Syticks",
      events
    };
    res.render("events", data);
  } catch (error) {}
});

router.get("/:id", async function (req, res, next) {
  const { id } = req.params;
  try {
    let event = await Events.findById(id);

    let data = {
      title: "Event | Syticks",
      event
    };

    res.render("event", data);
  } catch (error) {}
});

module.exports = router;
