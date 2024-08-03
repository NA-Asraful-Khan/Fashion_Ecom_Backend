const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const productRoutes = require("./routes/productRoutes");
const { notFound, errorHandler } = require("./middlewares/errorHandler");

const app = express();

app.use(express.json());
app.use(cors());

// Middleware to handle file uploads
app.use(
  fileUpload({
    useTempFiles: false, // Disable temporary files
  })
);

app.use("/uploads", express.static("src/uploads"));

// Routes
app.use("/api/products", productRoutes);

// Initial route
app.get("/", (req, res) => {
  res.send("Express App is Running");
});

// Middleware for handling 404 and errors
app.use(notFound);
app.use(errorHandler);

module.exports = app;
