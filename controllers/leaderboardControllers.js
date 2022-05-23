const User = require("../models/User");

exports.getLeaderboard = (req, res) => {
  try {
    User.find({}, (err, users) => {
      if (err) {
        return res.status(400).json({
          msg: "Error Occured",
          err,
        });
      }
      if (users) {
        const leaderboard = users.map((userObj) => {
          const { name, quizzesAttempted } = userObj;
          const quizzesAttemptedArr = quizzesAttempted.reduce((acc, curr) => {
            const { categoryId, score } = curr;
            const existingCategory = acc.find(
              (categoryObj) => categoryObj.categoryId === categoryId
            );
            if (existingCategory) {
              existingCategory.score += score;
            } else {
              acc.push({ categoryId, score, name });
            }
            return acc;
          }, []);
          return quizzesAttemptedArr;
        });
        return res.status(200).json({
          msg: "Leaderboard fetched successfully",
          leaderboard,
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
