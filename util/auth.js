exports.checkAuthentication = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

exports.checkNotAuthentication = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user === "admin") {
      return res.redirect("/admin");
    }

    return res.redirect("/users/" + req.user._id);
  }
  next();
};
