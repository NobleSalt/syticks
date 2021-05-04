const mongoose = require("mongoose");

// const { customAlphabet } = require("nanoid");

// const nanoid = customAlphabet(
//   "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
//   6
// );

const ticketSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true
    },
    user_id: {
      type: String,
      ref: "user",
      required: true
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "event",
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    trans_ref: {
      type: String,
      required: true,
      unique: true
    },
    trans_id: {
      type: String
    },
    flw_ref: String,
    card: {
      first_6digits: String,
      last_4digits: String,
      issuer: String,
      country: String,
      type: String,
      token: String,
      expiry: String
    },
    flw_created: Date,
    tickets: [{ type: mongoose.Schema.Types.ObjectId, ref: "tickets" }]
  },

  { timestamps: true }
);

module.exports = mongoose.model("tickets", ticketSchema);
