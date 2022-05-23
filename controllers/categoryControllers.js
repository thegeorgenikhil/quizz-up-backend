const Category = require("../models/Category");

exports.addCategory = async (req, res) => {
  try {
    const { categoryName, categoryLevel } = req.body;
    const newCategory = new Category({
      categoryName,
      categoryLevel,
    });
    const category = await newCategory.save();
    res.status(201).json({
      msg: "Category added successfully",
      category,
    });
  } catch (err) {
    res.status(400).json({
      msg: "Error Occured",
      err,
    });
  }
};
