import jwt from "jsonwebtoken";

/**
 * 🧩 Role-Aware Token Verification Middleware
 * Supports: user, agent, admin (future ready)
 */
export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 🧱 Step 1: Ensure header exists and has correct format
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No or invalid token provided" });
    }

    // 🧱 Step 2: Extract token
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Invalid token format" });
    }

    // 🧱 Step 3: Verify and decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🧱 Step 4: Attach decoded data to request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role || "user", // Default fallback for backward compatibility
    };

    next(); // ✅ Pass control to next middleware/route
  } catch (err) {
    console.error("❌ Token verification failed:", err.message);

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Session expired. Please log in again." });
    }

    res.status(401).json({ message: "Invalid or expired token" });
  }
};


// import jwt from "jsonwebtoken";

// export const verifyToken = (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   if (!authHeader)
//     return res.status(403).json({ message: "No token provided" });

//   const token = authHeader.split(" ")[1];
//   if (!token)
//     return res.status(403).json({ message: "Invalid token format" });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     req.user = {
//       id: decoded.id,
//       email: decoded.email,
//       role: decoded.role || "user",
//     };

//     next();
//   } catch (err) {
//     console.error("❌ Token verification failed:", err.message);
//     return res.status(401).json({ message: "Token invalid or expired" });
//   }
// };
