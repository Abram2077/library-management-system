const express = require("express");

const router = express.Router();

let pool;

router.setPool = (databasePool) => {
    pool = databasePool;
};

// GET transaction history
router.get("/", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                transactions.id,
                transactions.book_id,
                books.title AS book,
                transactions.user_id,
                users.name AS user_name,
                transactions.type,
                transactions.quantity,
                transactions.transaction_date
            FROM transactions
            JOIN books
                ON transactions.book_id = books.id
            LEFT JOIN users
                ON transactions.user_id = users.id
            ORDER BY transactions.id DESC
        `);

        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching transactions:", error.message);
        res.status(500).json({
            message: "Failed to fetch transactions"
        });
    }
});

// ADD STOCK or BORROW
router.post("/", async (req, res) => {
    const { book_id, user_id, type, quantity } = req.body;

    if (!book_id || !type || !quantity || quantity <= 0) {
        return res.status(400).json({
            message: "Book, type and positive quantity are required"
        });
    }

    if (!["ADD_STOCK", "BORROW"].includes(type)) {
        return res.status(400).json({
            message: "Invalid transaction type"
        });
    }

    if (type === "BORROW" && !user_id) {
        return res.status(400).json({
            message: "A user is required when borrowing a book"
        });
    }

    const client = await pool.connect();

    try {
        const { book_id, user_id, type, quantity } = req.body;

        if (!book_id || !type || !quantity || quantity <= 0) {
            return res.status(400).json({
                message: "Book, type and positive quantity are required"
            });
        }

        if (!["ADD_STOCK", "BORROW"].includes(type)) {
            return res.status(400).json({
                message: "Invalid transaction type"
            });
        }

        await client.query("BEGIN");

        const bookResult = await client.query(
            "SELECT * FROM books WHERE id = $1 FOR UPDATE",
            [book_id]
        );

        if (bookResult.rows.length === 0) {
            await client.query("ROLLBACK");

            return res.status(404).json({
                message: "Book not found"
            });
        }

        const book = bookResult.rows[0];

        if (type === "BORROW" && book.quantity < quantity) {
            await client.query("ROLLBACK");

            return res.status(400).json({
                message: "Not enough copies available"
            });
        }

        const newQuantity =
            type === "ADD_STOCK"
                ? book.quantity + quantity
                : book.quantity - quantity;

        await client.query(
            "UPDATE books SET quantity = $1 WHERE id = $2",
            [newQuantity, book_id]
        );

        const transactionResult = await client.query(
            `INSERT INTO transactions
                (book_id, user_id, type, quantity)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [book_id, user_id || null, type, quantity]
        );

        await client.query("COMMIT");

        res.status(201).json({
            message: "Transaction completed successfully",
            transaction: transactionResult.rows[0],
            new_quantity: newQuantity
        });

    } catch (error) {
        await client.query("ROLLBACK");

        console.error("Transaction error:", error.message);

        res.status(500).json({
            message: "Transaction failed"
        });
    } finally {
        client.release();
    }
});

module.exports = router;