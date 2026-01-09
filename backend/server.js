require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

const authRoutes = require("./routes/auth.routes");
const bookRoutes = require("./routes/book.routes");
const authMiddleware = require("./middlewares/auth.middleware");

app.use("/auth", authRoutes);


app.use("/books", authMiddleware, bookRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
