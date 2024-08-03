const express = require("express");
const { uploadImage, addProduct } = require("./product.controller");

const router = express.Router();

router.post("/upload", uploadImage);
router.post("/addproduct", addProduct);

module.exports = router;
