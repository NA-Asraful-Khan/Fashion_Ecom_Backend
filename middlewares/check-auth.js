const jwt = require("jsonwebtoken");

function checkAuth(req, res, next) {
  const token = req.header("auth-token");
  if (!token) {
    return res
      .status(401)
      .send({ errors: "Please Authenticate Using Valid Token" });
  }
  try {
    const data = jwt.verify(token, "secret_ecom");
    req.user = data?.user;
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return res
      .status(401)
      .send({ errors: "Please Authenticate using a valid token" });
  }
}

module.exports = { checkAuth };
