const Product = require("./product.model");
const Users = require("../user/user.model");
const cloudinary = require("../utils/cloudinary");
//Upload Image
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
// Create Product
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
    description: req.body.description,
    tags: req.body.tags,
  });
  await product.save();

  res.status(201).json({
    success: true,
    message: "Product Created Successfully",
    product: product,
  });
};

//Delete Product
const removeProduct = async (req, res) => {
  try {
    const exixtingProduct = await Product.findOneAndDelete({ id: req.body.id });
    if (!exixtingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({
      message: "Product Deleted Successfully",
    });
  } catch (error) {
    console.error("Error deleting Product:", error);
    res.status(500).json({
      message: "Something Went Wrong",
      error: error.message || "Internal Server Error",
    });
  }
};

//Creating API for getting all products
const allproducts = async (req, res) => {
  try {
    let products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching posts with author:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//Creating endpoint for new collection Data
const newCollection = async (req, res) => {
  try {
    let products = await Product.find({});
    let newCollection = products.slice(0).slice(-8);
    res.status(200).json(newCollection);
  } catch (error) {
    console.error("Error fetching posts with author:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
//Creating endpoint for Popular Women Data
const popularWomenCollection = async (req, res) => {
  try {
    let products = await Product.find({ category: "women" });
    let popularWomenCollection = products.slice(0, 4);
    res.status(200).json(popularWomenCollection);
  } catch (error) {
    console.error("Error fetching posts with author:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//Creating endpoint for Add to Cart
const addToCart = async (req, res) => {
  try {
    let userData = await Users.findOne({ _id: req?.user?.id });
    const itemId = req?.body?.itemId;
    if (itemId !== undefined && userData?.cartData) {
      userData.cartData[itemId] = (userData.cartData[itemId] || 0) + 1;
    }
    const updatedData = await Users.findOneAndUpdate(
      { _id: req?.user?.id },
      { cartData: userData?.cartData }
    );
    res.status(200).json(updatedData);
  } catch (error) {
    console.error("Error fetching posts with author:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//Creating endpoint for Add to Cart
const removeFromCart = async (req, res) => {
  try {
    let userData = await Users.findOne({ _id: req?.user?.id });
    const itemId = req?.body?.itemId;
    if (itemId !== undefined && userData?.cartData && itemId > 0) {
      userData.cartData[itemId] = (userData.cartData[itemId] || 0) - 1;
    }
    const updatedData = await Users.findOneAndUpdate(
      { _id: req?.user?.id },
      { cartData: userData?.cartData }
    );
    res.status(200).json(updatedData);
  } catch (error) {
    console.error("Error fetching posts with author:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//Creating endpoint for getCart
const getCart = async (req, res) => {
  try {
    let userData = await Users.findOne({ _id: req?.user?.id });
    res.status(200).json(userData?.cartData);
  } catch (error) {
    console.error("Error fetching posts with author:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  uploadImage,
  addProduct,
  removeProduct,
  allproducts,
  newCollection,
  popularWomenCollection,
  addToCart,
  removeFromCart,
  getCart,
};
