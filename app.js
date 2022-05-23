const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

// ROUTE IMPORTS
const authRoutes = require("./routes/auth");
const quizRoutes = require("./routes/quiz");

dotenv.config();

const app = express();

// MIDDLEWARE
app.use(express.json());
app.use(cors());

// ROUTES
app.use("/api", authRoutes);
app.use("/api", quizRoutes);

mongoose
  .connect(process.env.DATABASE, {
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
