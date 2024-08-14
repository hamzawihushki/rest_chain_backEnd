const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader =
    req.headers["authorization"] || req.headers["Authorization"];
  if (!authHeader) {
    return res.status(401).json({
      status: "fail",
      message: "No token provided.",
    });
  }
  const token = authHeader.split(" ")[1];
  try {
    const currentUser = jwt.verify(token, process.env.SECRET_KEY_JWT);
    req.currentUser = currentUser; // Add user to request object for further use in middleware or routes.
    console.log("currentUser", req.currentUser.payload.role);
    next();
  } catch (error) {
    return res.status(401).json({
      status: "fail",
      message: "Invalid token.",
    });
  }
};
module.exports = verifyToken;
