const axios = require("axios");
const { getUserProfile } = require("../controllers/users");
const User = require("../models/user");
const Transactions = require("../models/transactions");

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
      redirect_url: `https://sytickss.herokuapp.com/transaction/verify`,
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

    await Transactions.create(transaction_payload);

    let config = {
      headers: { Authorization: `Bearer ${process.env.FLW_SECRET}` }
    };

    const result = await axios.post(
      "https://api.flutterwave.com/v3/payments",
      payload,
      config
    );

    let data = {
      title: "Confirm Payment | Syticks",
      link: result.data.data.link
    };

    if (result.data.status == "success") {
      res.render("confirm", data);
    }

    console.log();
  } catch (error) {}
};

exports.verifyPayment = async (req, res) => {
  const { transaction_id, status, tx_ref } = req.params;

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
      } else {
      }
    }
  } catch (error) {}
};
