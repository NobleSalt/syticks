const bcrypt = require("bcrypt");
const UserModel = require("../models/user");
const passport = require("passport");

exports.createUser = async (req, res, next) => {
  const { name, email, username, phone, password, role } = req.body;
  let user;
  try {
    user = await UserModel.findOne({ username });

    if (user) {
      res.send("error");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user = new UserModel({
      name,
      password: hashedPassword,
      email,
      phone,
      username,
      role
    });

    let result = await user.save();
    res.redirect("/login");
    console.log(result);
  } catch (e) {
    res.redirect("/auth/new");
  }
};

exports.loginUser = async (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.redirect("/login");
    req.logIn(user, error => {
      if (err) return next(error);

      if (user.role === "admin") {
        return res.redirect("/admin");
      }
      return res.redirect("/users/" + req.user._id);
    });
  })(req, res, next);
};

exports.logoutUser = async (req, res) => {
  if (req.session) {
    await req.session.destroy(err => {
      if (err) {
        debug(err);
      } else res.redirect("/");
    });
  }
};
