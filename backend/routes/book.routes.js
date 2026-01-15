const express = require("express");
const router = express.Router();

const {
  getAllBooks,
  addBook,
  markBookAsRead,
  getActiveBooks,
  deleteBook
} = require("../controllers/book.controller");


router.get("/", getAllBooks);
router.post("/", addBook);
router.get("/active", getActiveBooks);
router.post("/:id/read", markBookAsRead);
router.delete("/:id", deleteBook);


module.exports = router;
