const mongoose = require("mongoose");

const { customAlphabet } = require("nanoid");

const nanoid = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  12
);

const eventSchema = new mongoose.Schema(
  {
    slug: { type: String, default: () => nanoid(), unique: true },

    name: {
      type: String,
      required: true
    },
    organiser: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "organiser"
    },

    description: {
      type: String,
      required: true
    },

    sponsors: [
      {
        type: String
      }
    ],
    images: [
      {
        url: String,
        public_id: String
      }
    ],
    pricings: [
      {
        priceName: String,
        priceAmount: String
      }
    ],

    tickets: [{ type: mongoose.Schema.Types.ObjectId, ref: "tickets" }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("event", eventSchema);
