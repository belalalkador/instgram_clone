import jwt from 'jsonwebtoken';

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.access_token;
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    req.id = decoded; // Storing the decoded token data, e.g., user ID, etc.

    next();
  } catch (error) {
    console.error("Token verification error:", error); // Log the error for debugging
    return res.status(500).json({
      success: false,
      message: "Something is wrong with the server!",
    });
  }
};
