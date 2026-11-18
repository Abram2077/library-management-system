const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const booksRouter = require("./routes/books");
const usersRouter = require("./routes/users");
const transactionsRouter = require("./routes/transactions");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

booksRouter.setPool(pool);
usersRouter.setPool(pool);
transactionsRouter.setPool(pool);

app.get("/", (req, res) => {
    res.json({
        message: "Library Management API is running"
    });
});

app.get("/test-db", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");

        res.json({
            message: "Database connected successfully",
            time: result.rows[0].now
        });
    } catch (error) {
        console.error("Database connection error:", error.message);

        res.status(500).json({
            message: "Database connection failed"
        });
    }
});

app.use("/books", booksRouter);
app.use("/users", usersRouter);
app.use("/transactions", transactionsRouter);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});