const express = require("express");

const app = express();

const PORT = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.json({ message: "You are on home" });
});

app.listen(PORT, () => console.log("listening on port 8000"));
