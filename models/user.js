const mongoose = require("mongoose");

const { customAlphabet } = require("nanoid");

const nanoid = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  6
);

const userSchema = new mongoose.Schema(
  {
    slug: { type: String, default: () => nanoid() },

    username: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },

    phone: {
      type: String,
      required: true
    },

    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },

    events: [{ type: mongoose.Schema.Types.ObjectId, ref: "event" }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", userSchema);
