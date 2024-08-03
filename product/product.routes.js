const express = require("express");
const {
  uploadImage,
  addProduct,
  removeProduct,
  allproducts,
} = require("./product.controller");

const router = express.Router();

router.post("/upload", uploadImage);
router.post("/addproduct", addProduct);
router.delete("/removeproduct", removeProduct);
router.get("/allproducts", allproducts);

module.exports = router;
