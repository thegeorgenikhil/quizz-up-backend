const express = require("express");
const {
  signup,
  signin,
  isAuthenticated,
} = require("../controllers/authControllers");

const router = express.Router();

router.post("/auth/signup", signup);
router.post("/auth/login", signin);

router.get("/get/quiz", isAuthenticated, (req, res) => {
  console.log("req.user", req.user);
  res.send("You are authenticated");
});

module.exports = router;
