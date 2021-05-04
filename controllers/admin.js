const userModel = require("../models/user");
const Organiser = require("../models/organisers");
const Event = require("../models/events");
const DataUri = require("datauri/parser");
const path = require("path");
const cloudinary = require("cloudinary");

exports.getAdminDash = async (req, res, next) => {
  let data;
  try {
    const { _id, role } = req.user;
    if (req.user.role !== "admin") {
      res.redirect("/login");
    }
    const user = await userModel
      .findOne({ _id, role })
      .select("-password -updatedAt -createdAt");
    if (!user) {
      res.redirect("/login");
    }
    data = {
      title: "Events | Syticks",
      user
    };

    res.render("admin-dash", data);
  } catch (error) {}
};

exports.getUpload = async (req, res, next) => {
  if (req.user.role !== "admin") {
    res.redirect("/login");
  }
  res.render("upload", { title: "Upload | Syticks" });
};

exports.handleUpload = async (req, res, next) => {
  const { name, organiser, sponsors, description, number, pricing } = req.body;
  console.log(req.body);
  let data;
  try {
    let organiserData = {
      name: organiser,
      phone: number
    };

    let org = await Organiser.create(organiserData);

    // work on the price
    let pricingArr = pricing.split(",");
    let pricings = pricingArr.reduce((acc, curr) => {
      let arr = curr.split("-");
      let priceName = arr[0];
      let priceAmount = arr[1];
      let obj = { priceName, priceAmount };
      return [...acc, obj];
    }, []);

    //  work on sponsors
    const sponsorArr = sponsors.split(",");

    data = {
      name,
      description,
      sponsors: sponsorArr,
      pricings,
      organiser: org._id
    };

    if (req.files) {
      data.images = [];

      let dtauri = new DataUri();
      for (const file of req.files) {
        let dataUri = dtauri.format(
          path.extname(file.originalname),
          file.buffer
        );

        let finalFile = dataUri.content;

        let image = await cloudinary.v2.uploader.upload_large(finalFile);

        data.images.push({
          url: image.secure_url,
          public_id: image.public_id
        });
      }
    }

    let result = await Event.create(data);

    org.event = result._id;
    await org.save();
  } catch (error) {}
};
