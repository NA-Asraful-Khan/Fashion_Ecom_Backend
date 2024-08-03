const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const Users = require("./user.model");

const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if the user already exists
    let existingUser = await Users.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        errors: "Email Already Exists",
      });
    }

    // Initialize cart data
    let cart = {};
    for (let i = 0; i < 300; i++) {
      cart[i] = 0;
    }

    // Hash the password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Create a new user
    const user = new Users({
      name: username,
      email: email,
      password: hashedPassword,
      cartData: cart,
    });

    // Save the user to the database
    await user.save();

    // Generate a JWT token
    const data = {
      user: {
        email: user.email,
      },
    };
    const token = jwt.sign(data, "secret_ecom", { expiresIn: "1h" });

    // Respond with the token
    res.status(201).json({
      success: true,
      token: token,
    });
  } catch (error) {
    console.error("Error during user signup:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const login = async (req, res) => {
  try {
    // Find the user by email
    const user = await Users.findOne({ email: req.body.email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid Credentials!",
      });
    }

    // Compare the password
    const isMatch = await bcryptjs.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Wrong Password!",
      });
    }

    // Generate JWT token
    const jwtSecret = "secret_ecom";
    const token = jwt.sign(
      {
        email: user.email,
      },
      jwtSecret
    );

    res.status(200).json({
      message: "Authentication Successful!!",
      token: token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

module.exports = {
  signup,
  login,
};
