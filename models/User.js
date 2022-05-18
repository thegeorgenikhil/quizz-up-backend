const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    encry_password: {
      type: String,
      required: true,
    },
    salt: String,
  },
  { timestamps: true }
);

userSchema.methods.securePassword = function (plainpassword) {
  if (!plainpassword) return "";
  try {
    return crypto
      .createHmac("sha256", this.salt)
      .update(plainpassword)
      .digest("hex");
  } catch (err) {
    return "";
  }
};

userSchema.methods.authenticate = function (plainpassword) {
  return this.securePassword(plainpassword) === this.encry_password;
};

userSchema.virtual("password").set(function (password) {
  this.salt = uuidv4();
  this.encry_password = this.securePassword(password);
});

module.exports = mongoose.model("User", userSchema);
