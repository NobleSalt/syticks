const Events = require("../models/events");

exports.getAll = async (req, res, next) => {
  try {
    let events = await Events.find({});

    let data = {
      title: "Events | Syticks",
      events
    };
    res.render("events", data);
  } catch (error) {}
};

exports.getOneEvent = async (req, res, next) => {
  const { slug } = req.params;
  console.log(slug);
  try {
    let event = await Events.findOne({ slug });
    console.log(event);

    let data = {
      title: "Event | Syticks",
      event
    };

    res.render("event", data);
  } catch (error) {
    console.log(error);
  }
};
