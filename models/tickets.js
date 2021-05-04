const mongoose = require("mongoose");

const { customAlphabet } = require("nanoid");

const nanoid = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  6
);

const ticketSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => nanoid() },

    user_id: {
      type: String,
      ref: "user",
      required: true
    },
    event: { type: mongoose.Schema.Types.ObjectId, ref: "event" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("tickets", ticketSchema);
