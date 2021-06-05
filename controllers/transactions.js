const axios = require("axios");
const { getUserProfile } = require("../controllers/users");
const User = require("../models/user");
const Transactions = require("../models/transactions");
const Tickets = require("../models/tickets");

const { customAlphabet } = require("nanoid");

const nanoid = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  20
);

exports.makePayment = async (req, res) => {
  let { amount } = req.body;
  let { _id } = req.user;
  let { slug } = req.params;
  let user = await User.findById(_id);
  console.log(req.body);

  let tranCode = nanoid();
  let tx_ref = "styicks-" + tranCode;

  try {
    let payload = {
      tx_ref,
      amount,
      currency: "NGN",
      redirect_url: `http://www.syticks.com.ng/transaction/verify`,
      payment_options: "card",

      customer: {
        id: user._id,
        email: user.email,
        phonenumber: user.phone,
        name: user.username
      },
      customizations: {
        title: "Syitcks",
        description: "Best online market place to get your event tickets",
        logo: "https://assets.piedpiper.com/logo.png"
      }
    };

    let transaction_payload = {
      amount,
      trans_ref: tx_ref,
      event: slug,
      user_id: _id
    };

    let ticketPayload = {
      user_id: user._id,
      TotalNumber: amount,
      transaction_ref: tx_ref,
      event: slug
    };

    await Transactions.create(transaction_payload);
    await Tickets.create(ticketPayload);

    let config = {
      headers: { Authorization: `Bearer ${process.env.FLW_SECRET}` }
    };

    const result = await axios.post(
      "https://api.flutterwave.com/v3/payments",
      payload,
      config
    );

    let link = result.data.data.link;

    if (result.data.status == "success") {
      res.redirect(link);
    }
  } catch (error) {
    console.log(error);
  }
};

exports.verifyPayment = async (req, res) => {
  const { tx_ref, transaction_id, status } = req.query;

  // const { fl_path } = req.params;
  /* let tx_ref;
  let transaction_id;
  let status;

  let options = fl_path.split("&");

  tx_ref = options[0].split("=")[1];
  transaction_id = options[1].split("=")[1];
  status = options[2].split("=")[1]; */

  try {
    const tranx = await Transactions.findOne({ trans_ref: tx_ref });
    if (status === "success" && tranx) {
      const url = `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`;

      let config = {
        headers: { Authorization: `Bearer ${process.env.FLW_SECRET}` }
      };

      const { data } = await axios.get(url, config);

      if (data.status == "success") {
        tranx.trans_id = transaction_id;
        tranx.flw_ref = data.flw_ref;
        tranx.flw_created = data.created_at;

        let card = {
          first_6digits: data.card.first_6digits,
          last_4digits: data.card.last_4digits,
          issuer: data.card.issuer,
          country: data.card.country,
          type: data.card.type,
          token: data.card.token,
          expiry: data.card.expiry
        };

        tranx.card = card;

        await tranx.save();
        let ticket = await Tickets.findOne({ transaction_ref: tx_ref });

        ticket.paid = true;
        await ticket.save();
        res.redirect(`/transaction/complete/${tx_ref}`);
      } else {
        throw new Error("Transaction Could not be verified at the moment");
      }
    }
  } catch (error) {
    console.log(error);
  }
};

exports.greet = async (req, res) => {
  let { tx_ref } = req.params;

  try {
    let ticket = Ticket.findOne({
      transaction_ref: tx_ref
    }).populate("user_id");

    if (ticket) {
      let data = {
        ticket: ticket.slug,
        user: ticket.user_id.slug
      };

      res.render("thanks", data);
    }
  } catch (error) {
    console.log(error);
  }
};
