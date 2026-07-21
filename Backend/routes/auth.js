const express = require("express");

const router = express.Router();

const authController = require("../controllers/auth.js");

router.get("/", (req, res) => {
  res.send("auth routes");
});
router.post("/login", authController.login);
router.patch("/logout", authController.logout);

module.exports = router;
