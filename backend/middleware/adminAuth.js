import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config(); // ✅ Load .env file

const JWT_SECRET = process.env.JWT_SECRET;

// const adminAuth = (req, res, next) => {
//   const token = req.header("Authorization")?.replace("Bearer ", "");

//   if (!token) return res.status(401).json({ message: "No token, authorization denied" });

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET);
//     req.admin = decoded;
//     req.adminId = admin._id; 
//     next();
//   } catch (err) {
//     res.status(401).json({ message: "Token is not valid" });
//   }
// };

const adminAuth = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
console.log("🔍 Incoming Token:", token);
  if (!token) return res.status(401).json({ message: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
req.admin = decoded;
req.adminId = decoded.id;
next();

  } catch (err) {
    console.error("Admin auth error:", err);
    res.status(401).json({ message: "Token is not valid" });
  }
};

export default adminAuth;
