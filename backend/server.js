require("dotenv").config();

const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT || 5000;

const connectDB = require("./config/db");

const app = express();

connectDB();

app.use(
  cors({
    origin: "*",
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

const authRoutes = require("./routes/auth.routes");
const bookRoutes = require("./routes/book.routes");
const authMiddleware = require("./middlewares/auth.middleware");

app.use("/auth", authRoutes);


app.use("/books", authMiddleware, bookRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

