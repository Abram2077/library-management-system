const express = require("express");

const router = express.Router();

let pool;

router.setPool = (databasePool) => {
    pool = databasePool;
};

// LOGIN user
router.post("/login", async (req, res) => {
    try {
        const { membership_id } = req.body;

        if (!membership_id) {
            return res.status(400).json({
                message: "Membership ID is required"
            });
        }

        const result = await pool.query(
            `SELECT id, name, membership_id, role
             FROM users
             WHERE membership_id = $1`,
            [membership_id]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                message: "Invalid membership ID"
            });
        }

        res.json({
            message: "Login successful",
            user: result.rows[0]
        });
    } catch (error) {
        console.error("Login error:", error.message);

        res.status(500).json({
            message: "Login failed"
        });
    }
});

// GET all users
router.get("/", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM users ORDER BY id"
        );

        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching users:", error.message);
        res.status(500).json({ message: "Failed to fetch users" });
    }
});

// GET one user
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "SELECT * FROM users WHERE id = $1",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error fetching user:", error.message);
        res.status(500).json({ message: "Failed to fetch user" });
    }
});

// ADD user
router.post("/", async (req, res) => {
    try {
        const { name, membership_id, role } = req.body;

        if (!name || !membership_id || !role) {
            return res.status(400).json({
                message: "Name, membership ID and role are required"
            });
        }

        const result = await pool.query(
            `INSERT INTO users (name, membership_id, role)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [name, membership_id, role]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Error adding user:", error.message);
        res.status(500).json({ message: "Failed to add user" });
    }
});

// UPDATE user
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, membership_id, role } = req.body;

        if (!name || !membership_id || !role) {
            return res.status(400).json({
                message: "Name, membership ID and role are required"
            });
        }

        const result = await pool.query(
            `UPDATE users
             SET name = $1,
                 membership_id = $2,
                 role = $3
             WHERE id = $4
             RETURNING *`,
            [name, membership_id, role, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error updating user:", error.message);
        res.status(500).json({ message: "Failed to update user" });
    }
});

// DELETE user
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "DELETE FROM users WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json({
            message: "User deleted successfully",
            user: result.rows[0]
        });
    } catch (error) {
        console.error("Error deleting user:", error.message);
        res.status(500).json({ message: "Failed to delete user" });
    }
});

module.exports = router;