require("./config/dotenv.config");
const app = require("./app");
const connectDB = require("./config/db");

// Connect to database
connectDB();

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server is running at http://localhost:${PORT}`);
});
