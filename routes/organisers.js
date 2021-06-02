const express = require("express");
const router = express.Router();
const { checkAuthentication } = require("../util/auth");

const OrganiserModel = require("../models/organisers");

/* GET users listing. */
router.get("/:organiser_id", async function (req, res, next) {
  const { organiser_id } = req.params;

  try {
    let organiser = await OrganiserModel.findOne({ _id: organiser_id });

    res.render("organiser-dash", {
      title: "Organiser's Dashboard | Syticks",
      data: {
        id: organiser._id
      }
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/:organiser_id/detail", function (req, res, next) {
  res.render("organiser-detail", { title: "Register | Syticks" });
});

module.exports = router;
