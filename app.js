const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// ROUTE IMPORTS
const authRoutes = require("./routes/auth");

dotenv.config();

const app = express();

// MIDDLEWARE
app.use(express.json());

// ROUTES
app.use("/api", authRoutes);

mongoose
  .connect("mongodb://127.0.0.1:27017/quizzup", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connected"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.json({ message: "You are on home" });
});

app.listen(PORT, () => console.log("listening on port 8000"));
