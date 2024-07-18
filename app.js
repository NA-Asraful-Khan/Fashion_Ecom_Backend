require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const path = require('path');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const cloudinary = require('./utils/cloudinary');

const app = express();

app.use(express.json());
app.use(cors());

// Middleware to handle file uploads
app.use(fileUpload({
  useTempFiles: false // Disable temporary files
}));

app.use('/uploads', express.static('src/uploads'));

// Upload route
app.post('/upload', async (req, res) => {
  try {
    if (!req.files || !req.files.image) {
      return res.status(400).json({ success: 0, message: 'No image file uploaded' });
    }

    let image = req.files.image;

    // Upload the image to Cloudinary in the ecomProduct folder and transform to AVIF
    await cloudinary.uploader.upload_stream({
      folder: 'ecomProduct', // Specify the folder
      format: 'avif', // Convert to AVIF format
      quality: 'auto' // Automatically optimize quality
    }, (error, result) => {
      if (error) {
        console.error('Error uploading file to Cloudinary:', error);
        return res.status(500).json({ success: 0, message: 'File upload failed', error });
      }
      res.json({
        success: 1,
        image_url: result.secure_url
      });
    }).end(image.data);
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: 0, message: 'File upload failed', error });
  }
});


// Schema for CREATING Product 
const Product=mongoose.model("Product",{
  id:{
    type:Number,
    required:true,
  },
  name:{
    type:String,
    required:true,
  },
  image:{
    type:String,
    required:true,
  },
  category:{
    type:String,
    required:true,
  },
  new_price:{
    type:Number,
    required:true,
  },
  old_price:{
    type:Number,
    required:true,
  },
  date:{
    type:Date,
    default:Date.now,
  },
  available:{
    type:Boolean,
    default:true
  }
})

app.post('/addproduct',async(req,res)=>{
  let products = await Product.find({});
  let id;
  if(products.length>0){
    let last_product_array=products.slice(-1);
    let last_product = last_product_array[0];
    id=last_product.id+1
  }else{
    id=1;
  }
    const product = new Product({
      id:id,
      name:req.body.name,
      image:req.body.image,
      category:req.body.category,
      new_price:req.body.new_price,
      old_price:req.body.old_price,
    })
    console.log(product)
    await product.save()
    console.log("saved")

    res.json({
      success:true,
      name:req.body.name
    })
})

// Initial route
app.get('/', (req, res) => {
  res.send('Express App is Running');
});

// Invalid route
app.use((req, res, next) => {
  res.status(404).json({ message: "Resource not found!" });
});

// Server error route
app.use((err, req, res, next) => {
  res.status(500).json({ message: "Something broke" });
});

module.exports = app;
