const express = require("express");
const { uploadImage, addProduct } = require("../controllers/productController");

const router = express.Router();

router.post("/upload", uploadImage);
router.post("/addproduct", addProduct);

module.exports = router;
