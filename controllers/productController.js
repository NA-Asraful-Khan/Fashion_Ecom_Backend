const Product = require("../models/Product");
const cloudinary = require("../utils/cloudinary");

const uploadImage = async (req, res) => {
  try {
    if (!req.files || !req.files.image) {
      return res
        .status(400)
        .json({ success: 0, message: "No image file uploaded" });
    }

    let image = req.files.image;

    // Upload the image to Cloudinary in the ecomProduct folder and transform to AVIF
    await cloudinary.uploader
      .upload_stream(
        {
          folder: "ecomProduct",
          format: "avif",
          quality: "auto",
        },
        (error, result) => {
          if (error) {
            console.error("Error uploading file to Cloudinary:", error);
            return res
              .status(500)
              .json({ success: 0, message: "File upload failed", error });
          }
          res.json({
            success: 1,
            image_url: result.secure_url,
          });
        }
      )
      .end(image.data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: 0, message: "File upload failed", error });
  }
};

const addProduct = async (req, res) => {
  let products = await Product.find({});
  let id;
  if (products.length > 0) {
    let last_product_array = products.slice(-1);
    let last_product = last_product_array[0];
    id = last_product.id + 1;
  } else {
    id = 1;
  }
  const product = new Product({
    id: id,
    name: req.body.name,
    image: req.body.image,
    category: req.body.category,
    new_price: req.body.new_price,
    old_price: req.body.old_price,
  });
  console.log(product);
  await product.save();
  console.log("saved");

  res.json({
    success: true,
    name: req.body.name,
  });
};

module.exports = {
  uploadImage,
  addProduct,
};
