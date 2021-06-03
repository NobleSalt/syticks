const express = require("express");
const {
  getAdminDash,
  getUpload,
  handleUpload
} = require("../controllers/admin");
const { checkAuthentication } = require("../util/auth");
let { cloudConfig } = require("../controllers/cloudinary");

const multer = require("multer");
let storage = multer.memoryStorage();
let uploads = multer({ storage: storage }).array("media");

const router = express.Router();

/* GET users listing. */
router.get("/", checkAuthentication, getAdminDash);

router.get("/upload", checkAuthentication, getUpload);
router.post("/upload", uploads, checkAuthentication, cloudConfig, handleUpload);

module.exports = router;
