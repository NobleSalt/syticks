const mongoose = require("mongoose");

const { customAlphabet } = require("nanoid");

const nanoid = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  6
);

const ticketSchema = new mongoose.Schema(
  {
    slug: { type: String, default: () => nanoid() },
    TotalAmount: Number,
    user_id: {
      type: String,
      ref: "user",
      required: true
    },
    event: { type: mongoose.Schema.Types.ObjectId, ref: "event" },
    paid: {
      type: Boolean,
      default: false
    },
    transaction_ref: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("tickets", ticketSchema);
