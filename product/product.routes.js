const express = require("express");
const productController = require("./product.controller");
const { checkAuth } = require("../middlewares/check-auth");

const router = express.Router();

router.post("/upload", productController.uploadImage);
router.post("/addproduct", productController.addProduct);
router.post("/addtocart", checkAuth, productController.addToCart);
router.delete("/removeproduct", productController.removeProduct);
router.get("/allproducts", productController.allproducts);
router.get("/newCollection", productController.newCollection);
router.get("/popularinwomen", productController.popularWomenCollection);

module.exports = router;
