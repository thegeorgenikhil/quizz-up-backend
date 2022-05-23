const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  try {
    const { name, password, email } = req.body;

    const checkIfUserExists = await User.findOne({ email });

    if (checkIfUserExists) {
      return res.status(400).json({
        msg: "User already exists. Please Login.",
      });
    }

    const newUser = new User({
      name,
      email,
      password,
    }).save((err, user) => {
      if (err)
        return res.status(500).json({ msg: "Failed to save to DB", err });
      if (user) {
        const { _id, name, email } = user;
        const token = jwt.sign({ _id, name, email }, process.env.JWT_SECRET, {
          expiresIn: "48h",
        });
        return res.status(201).json({
          msg: "Signup Successfull!",
          user: { _id, name, email, token },
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

exports.signin = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(403).json({
        msg: "User not found in DB",
        err,
      });
    }

    const { _id, email, name } = user;
    const token = jwt.sign({ _id, name, email }, process.env.JWT_SECRET, {
      expiresIn: "48h",
    });
    if (user.authenticate(password)) {
      return res.status(200).json({
        user: { _id, email, name, token },
        msg: "Successfully Signed In",
      });
    }

    return res.status(401).json({
      err: "User email and passwords do not match. Please Enter Valid Credentials",
    });
  });
};

exports.isAuthenticated = (req, res, next) => {
  const bearerHeader = req.headers.authorization;
  const bearer = bearerHeader.split(" ");
  const encodedToken = bearer[1];
  if (encodedToken) {
    jwt.verify(encodedToken, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          msg: "Invalid Token",
          err,
        });
      }
      req.user = decoded;
      next();
    });
  } else {
    return res.status(403).json({
      msg: "No Token Provided",
    });
  }
};
