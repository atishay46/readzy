const express = require("express");
const router = express.Router();

const { signup, login } = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const User = require("../models/User.model"); // ✅ CORRECT PATH

// 🔐 Get current logged-in user
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("GET /auth/me error:", error);
    res.status(500).json({ message: "Failed to fetch user" });
  }
});

router.post("/signup", signup);
router.post("/login", login);

module.exports = router;
