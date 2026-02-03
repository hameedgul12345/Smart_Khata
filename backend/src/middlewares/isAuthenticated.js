import jwt from "jsonwebtoken";

const isAuthenticated = (req, res, next) => {
;

  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized, token missing",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // console.log(decoded)

    req.userId = decoded.id;
    // console.log("isAuthenticated token set",req.userId)
    next();

  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized, invalid token",
    });
  }
};

export default isAuthenticated;
