const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    const error = new Error("Not authorized");
    error.code = 401;
    next(error);
  } else {
    const [, token] = authHeader.split(" ")[1];

    if (!token) {
      const error = new Error("Token missing");
      error.code = 401;
      next(error);
    } else {
      try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.username = user.username;
        req.userId = user.id;
        next();
      } catch (error) {
        error.message = "Token invalid";
        error.code = 401;
        next(error);
      }
    }
  }
};

module.exports = auth;
