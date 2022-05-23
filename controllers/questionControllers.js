const Category = require("../models/Category");
const User = require("../models/User");
exports.addQuestion = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { question, questionOptions, questionAnswer } = req.body;
    Category.findOneAndUpdate(
      { _id: categoryId },
      { $push: { questions: { question, questionOptions, questionAnswer } } },
      { new: true },
      (err, category) => {
        if (err || !category) {
          return res.status(400).json({
            msg: "Question could not be added",
            err,
          });
        }
        if (category)
          return res.status(201).json({
            msg: "Question added successfully",
            category,
          });
      }
    );
  } catch (err) {
    return res.status(400).json({
      msg: "Error Occured",
      err,
    });
  }
};

exports.getQuestionsByCategoryId = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        msg: "Please login to view questions",
      });
    }
    const { categoryId } = req.params;
    Category.findOne({ _id: categoryId }, (err, category) => {
      if (err || !category) {
        return res.status(400).json({
          msg: "Category not found",
          err,
        });
      }
      if (category) {
        const filteredQuestionArr = category.questions.map((questionObj) => {
          return { ...questionObj.toObject(), questionAnswer: undefined };
        });
        return res.status(200).json({
          msg: "Questions fetched successfully",
          category: {
            ...category.toObject(),
            questions: filteredQuestionArr,
          },
        });
      }
    });
  } catch (err) {
    return res.status(400).json({
      msg: "Error Occured",
      err,
    });
  }
};

exports.submitQuiz = async (req, res) => {
  try {
    const { categoryId } = req.body;
    const categoryInfo = await Category.findOne({ _id: categoryId });
    if (!categoryInfo)
      return res.status(400).json({
        msg: "Category Not Found",
      });
    const { questions } = categoryInfo;
    const { userAnswers } = req.body;
    let userScore = 0;
    const compareAnswer = await userAnswers.map((userAnswer) => {
      const questionFound = questions.find(
        (question) => userAnswer.questionId === question.id
      );
      if (questionFound) {
        if (questionFound.questionAnswer === userAnswer.answer) {
          userScore += 2;
        }
      }

      return { ...questionFound.toObject(), userAnswered: userAnswer.answer };
    });
    User.findOneAndUpdate(
      { _id: req.user._id },
      {
        $push: {
          quizzesAttempted: { categoryId, userScore },
        },
      },
      { new: true },
      (err, user) => {
        if (err || !user) {
          return res.status(400).json({
            msg: "Error Occured",
            err,
          });
        }
        if (user) {
          return res.status(200).json({
            msg: "Results submitted successfully",
            results: {
              compareAnswer,
              finalScore: userScore,
            },
          });
        }
      }
    );
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      msg: "Error Occured",
      error,
    });
  }
};
