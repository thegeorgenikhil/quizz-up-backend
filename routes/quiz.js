const express = require("express");
const { isAuthenticated } = require("../controllers/authControllers");
const { addCategory } = require("../controllers/categoryControllers");
const { getLeaderboard } = require("../controllers/leaderboardControllers");
const {
  addQuestion,
  getQuestionsByCategoryId,
  submitQuiz,
} = require("../controllers/questionControllers");

const router = express.Router();

router.post("/quiz/add/category", addCategory);
router.post("/quiz/add/:categoryId/question", addQuestion);

router.get(
  "/quiz/get/:categoryId/questions",
  isAuthenticated,
  getQuestionsByCategoryId
);
router.post("/quiz/submit", isAuthenticated, submitQuiz);
router.get("/quiz/leaderboard", getLeaderboard);
// router.post("/quiz/post/question",postQuestion)

module.exports = router;
