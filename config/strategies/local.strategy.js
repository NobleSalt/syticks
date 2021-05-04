const passport = require("passport");
const Strategy = require("passport-local").Strategy;
const User = require("../../models/user");
const bcrypt = require("bcrypt");

module.exports = function localStrategy() {
  passport.use(
    new Strategy(
      {
        usernameField: "username",
        passwordField: "password"
      },
      async (username, password, done) => {
        const user = await User.findOne({ username });
        // console.log(user)
        if (user == null) {
          return done(null, false, { message: "User does not exist." });
        }

        try {
          if (await bcrypt.compare(password, user.password)) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Incorrect Password" });
          }
        } catch (err) {
          console.log(err);
          done(err);
        }
      }
    )
  );
};
