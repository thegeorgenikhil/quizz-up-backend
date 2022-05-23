const express = require("express");
const {
  signup,
  signin,
  isAuthenticated,
} = require("../controllers/authControllers");

const router = express.Router();

router.post("/auth/signup", signup);
router.post("/auth/login", signin);

module.exports = router;
