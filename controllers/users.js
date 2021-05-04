const userModel = require("../models/user");

exports.getUserProfile = async (req, res, next) => {
  let data;
  try {
    const { _id, role } = req.user;
    const { id } = req.params;

    if (_id !== id) {
      res.redirect("/login");
    }
    const user = await userModel
      .findOne({ _id, role })
      .select("-password -updatedAt -createdAt");
    if (!user) {
      res.redirect("/login");
    }
    data = {
      title: "Profile | Syticks",
      user
    };

    res.render("profile", data);
  } catch (error) {}
};
