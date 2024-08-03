const notFound = (req, res, next) => {
  res.status(404).json({ message: "Resource not found!" });
};

const errorHandler = (err, req, res, next) => {
  res.status(500).json({ message: "Something broke" });
};

module.exports = {
  notFound,
  errorHandler,
};
