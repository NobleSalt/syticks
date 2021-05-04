const express = require("express");
const {
  getAdminDash,
  getUpload,
  handleUpload
} = require("../controllers/admin");
const router = express.Router();
const { checkAuthentication } = require("../util/auth");

const multer = require("multer");
let storage = multer.memoryStorage();
let uploads = multer({ storage }).array("media");

let { cloudConfig } = require("../controllers/cloudinary");

/* GET users listing. */
router.get("/", checkAuthentication, getAdminDash);

router.get("/upload", checkAuthentication, getUpload);
router.post("/upload", uploads, checkAuthentication, cloudConfig, handleUpload);

module.exports = router;
