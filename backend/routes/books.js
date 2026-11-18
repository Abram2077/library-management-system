const express = require("express");

const router = express.Router();

let pool;

router.setPool = (databasePool) => {
    pool = databasePool;
};

// GET all books
router.get("/", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM books ORDER BY id"
        );

        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching books:", error.message);
        res.status(500).json({ message: "Failed to fetch books" });
    }
});

// GET one book
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "SELECT * FROM books WHERE id = $1",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error fetching book:", error.message);
        res.status(500).json({ message: "Failed to fetch book" });
    }
});

// ADD book
router.post("/", async (req, res) => {
    try {
        const { title, author, genre, isbn, quantity } = req.body;

        if (!title || !author || !genre || !isbn || quantity === undefined) {
            return res.status(400).json({
                message: "All book fields are required"
            });
        }

        const result = await pool.query(
            `INSERT INTO books (title, author, genre, isbn, quantity)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [title, author, genre, isbn, quantity]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Error adding book:", error.message);
        res.status(500).json({ message: "Failed to add book" });
    }
});

// UPDATE book
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { title, author, genre, isbn, quantity } = req.body;

        if (!title || !author || !genre || !isbn || quantity === undefined) {
            return res.status(400).json({
                message: "All book fields are required"
            });
        }

        const result = await pool.query(
            `UPDATE books
             SET title = $1,
                 author = $2,
                 genre = $3,
                 isbn = $4,
                 quantity = $5
             WHERE id = $6
             RETURNING *`,
            [title, author, genre, isbn, quantity, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error updating book:", error.message);
        res.status(500).json({ message: "Failed to update book" });
    }
});

// DELETE book
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "DELETE FROM books WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        res.json({
            message: "Book deleted successfully",
            book: result.rows[0]
        });
    } catch (error) {
        console.error("Error deleting book:", error.message);
        res.status(500).json({ message: "Failed to delete book" });
    }
});

module.exports = router;