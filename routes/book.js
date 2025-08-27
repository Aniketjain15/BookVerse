const router = require("express").Router();
const Book = require("../models/book");
const { authenticateToken } = require("./userAuth");
const User = require("../models/user");

//create book -- admin
router.post("/add-book", async (req, res) => {
  try {
    const { url, title, author, price, desc, language, rating } = req.body;

    if (!url || !title || !author || !price || !desc || !language) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newBook = new Book({
      url,
      title,
      author,
      price,
      desc,
      language,
      rating: rating || 0, // ⭐ default 0
    });

    await newBook.save();
    res.status(201).json({ message: "Book added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

//update book --admin
router.put("/update-book", async (req, res) => {
  try {
    const { bookid, url, title, author, price, desc, language, rating } = req.body;

    const updatedBook = await Book.findByIdAndUpdate(
      bookid,
      { url, title, author, price, desc, language, rating },  // ✅ include rating
      { new: true }
    );

    res.json({ status: "Success", message: "Book updated", data: updatedBook });
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
});

//delete book --admin
router.delete("/delete-book", authenticateToken, async (req, res) => {
  try {
    const { bookid } = req.headers;
    await Book.findByIdAndDelete(bookid);
    return res.json({
      status: "Success",
      message: "Book deleted successfully!",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

//get all books
router.get("/get-all-books", async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    return res.json({
      status: "Success",
      data: books,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

//get recently added books
router.get("/get-recent-books", async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 }).limit(4);
    return res.json({
      status: "Success",
      data: books,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

//get book by id
// router.get("/get-book-by-id/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const book = await Book.findById(id);
//     return res.json({
//       status: "Success",
//       data: book,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: "An error occurred" });
//   }
// });

// module.exports = router;
// 📌 Get Book by ID (with rating)
router.get("/get-book-by-id/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({
        status: "Fail",
        message: "Book not found",
      });
    }

    return res.status(200).json({
      status: "Success",
      data: {
        _id: book._id,
        title: book.title,
        author: book.author,
        price: book.price,
        url: book.url,
        rating: book.rating || 0, // ✅ always include rating
        description: book.description || "",
      },
    });
  } catch (error) {
    console.error("Error fetching book by ID:", error);
    return res.status(500).json({
      status: "Error",
      message: "Internal Server Error",
    });
  }
});
