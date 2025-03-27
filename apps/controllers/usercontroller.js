const express = require("express");
const router = express.Router();
const UserService = require("../services/userService");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/setting.json");
const userService = new UserService();
const { verifyToken, isAdmin } = require("../util/VerifyToken");
//trang dang ki
router.get("/register", (req, res) => {
  res.render("users/signup"); // Assuming the signup.ejs is inside the 'views/users/' folder
});

router.get("/login", (req, res) => {
  res.render("users/login");
});

// Đăng ký người dùng mới
router.post("/register", async (req, res) => {
  const { username, email, password, confirmPassword, role = "user" } = req.body;

  if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
  }

  try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = { username, email, password: hashedPassword, role, active: true };
      await userService.insertUser(user);
      res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
      res.status(500).json({ message: "Registration error", error });
  }
});

router.post("/login", async (req, res) => {
  try {
      const user = await userService.getUserByEmail(req.body.email);
      if (!user) throw new Error("User not found");

      const passwordIsValid = await bcrypt.compare(req.body.password, user.password);
      if (!passwordIsValid) throw new Error("Invalid credentials");

      const token = jwt.sign({ id: user._id, role: user.role }, config.jwt.secret, { expiresIn: '1h' });
      res.status(200).json({ token, role: user.role });
  } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

router.get("/profile", (req, res) => {
  res.render("users/profile", { user: req.user });
});

// Route cập nhật thông tin cá nhân
router.post("/profile/update", async (req, res) => {
  const { username, email } = req.body;
  const userId = req.user.id;

  try {
      const updatedUser = await userService.updateUser({ _id: userId, username, email });
      if (!updatedUser) return res.status(404).json({ message: "User not found" });

      res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
      res.status(500).json({ message: "Error updating profile", error });
  }
});


module.exports = router;
