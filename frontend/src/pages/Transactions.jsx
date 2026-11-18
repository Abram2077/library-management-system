import { useEffect, useState } from "react";
import {
    getBooks,
    getUsers,
    getTransactions,
    createTransaction
} from "../api";

const emptyForm = {
    book_id: "",
    user_id: "",
    type: "BORROW",
    quantity: 1
};

function Transactions() {
    const [books, setBooks] = useState([]);
    const [users, setUsers] = useState([]);
    const [transactions, setTransactions] = useState([]);

    const [form, setForm] = useState(emptyForm);

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    async function loadData() {
        try {
            setLoading(true);

            const [booksData, usersData, transactionsData] =
                await Promise.all([
                    getBooks(),
                    getUsers(),
                    getTransactions()
                ]);

            setBooks(booksData);
            setUsers(usersData);
            setTransactions(transactionsData);
        } catch (error) {
            console.error(error);
            setError("Unable to load transaction data.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadData();
    }, []);

    function handleChange(event) {
        const { name, value } = event.target;

        setForm((currentForm) => ({
            ...currentForm,
            [name]: value
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setMessage("");
        setError("");

        if (!form.book_id) {
            setError("Please select a book.");
            return;
        }

        if (form.type === "BORROW" && !form.user_id) {
            setError("Please select the user borrowing the book.");
            return;
        }

        if (Number(form.quantity) <= 0) {
            setError("Quantity must be greater than zero.");
            return;
        }

        const selectedBook = books.find(
            (book) => book.id === Number(form.book_id)
        );

        if (
            form.type === "BORROW" &&
            selectedBook &&
            Number(form.quantity) > selectedBook.quantity
        ) {
            setError(
                `Only ${selectedBook.quantity} copies are available.`
            );
            return;
        }

        try {
            setSubmitting(true);

            const result = await createTransaction({
                book_id: Number(form.book_id),
                user_id: form.user_id
                    ? Number(form.user_id)
                    : null,
                type: form.type,
                quantity: Number(form.quantity)
            });

            setMessage(
                `${form.type === "BORROW" ? "Book borrowed" : "Stock added"} successfully. New quantity: ${result.new_quantity}`
            );

            setForm(emptyForm);

            await loadData();
        } catch (error) {
            console.error(error);
            setError("Transaction could not be completed.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <section>
            <div className="page-title">
                <h1>Transactions</h1>
                <p>
                    Manage borrowing, stock and transaction history.
                </p>
            </div>

            <div className="form-card">
                <h2>New Transaction</h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-grid">

                        <div className="form-group">
                            <label>Transaction Type</label>

                            <select
                                name="type"
                                value={form.type}
                                onChange={handleChange}
                            >
                                <option value="BORROW">
                                    Borrow Book
                                </option>

                                <option value="ADD_STOCK">
                                    Add Stock
                                </option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Book</label>

                            <select
                                name="book_id"
                                value={form.book_id}
                                onChange={handleChange}
                            >
                                <option value="">
                                    Select a book
                                </option>

                                {books.map((book) => (
                                    <option
                                        key={book.id}
                                        value={book.id}
                                    >
                                        {book.title} — {book.quantity} available
                                    </option>
                                ))}
                            </select>
                        </div>

                        {form.type === "BORROW" && (
                            <div className="form-group">
                                <label>Borrower</label>

                                <select
                                    name="user_id"
                                    value={form.user_id}
                                    onChange={handleChange}
                                >
                                    <option value="">
                                        Select a user
                                    </option>

                                    {users.map((user) => (
                                        <option
                                            key={user.id}
                                            value={user.id}
                                        >
                                            {user.name} — {user.membership_id}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div className="form-group">
                            <label>Quantity</label>

                            <input
                                type="number"
                                name="quantity"
                                min="1"
                                value={form.quantity}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            type="submit"
                            className="primary-button"
                            disabled={submitting}
                        >
                            {submitting
                                ? "Processing..."
                                : form.type === "BORROW"
                                ? "Borrow Book"
                                : "Add Stock"}
                        </button>
                    </div>
                </form>

                {message && (
                    <p className="success-message">
                        {message}
                    </p>
                )}

                {error && (
                    <p className="error-message">
                        {error}
                    </p>
                )}
            </div>

            <div className="table-card">
                <div className="section-header">
                    <h2>Current Book Availability</h2>

                    <span>
                        {books.length} titles
                    </span>
                </div>

                {loading ? (
                    <p>Loading books...</p>
                ) : (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Book</th>
                                    <th>Author</th>
                                    <th>Quantity</th>
                                    <th>Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {books.map((book) => (
                                    <tr key={book.id}>
                                        <td>{book.title}</td>
                                        <td>{book.author}</td>
                                        <td>{book.quantity}</td>
                                        <td>
                                            <span
                                                className={
                                                    book.quantity < 2
                                                        ? "status-low"
                                                        : "status-available"
                                                }
                                            >
                                                {book.quantity < 2
                                                    ? "Low Stock"
                                                    : "Available"}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div className="table-card">
                <div className="section-header">
                    <h2>New Transaction</h2>

                    <p className="form-description">
                        Record book borrowing or add new stock to the library.
                    </p>

                    <span>
                        {transactions.length} transactions
                    </span>
                </div>

                {loading ? (
                    <p>Loading transactions...</p>
                ) : transactions.length === 0 ? (
                    <p>No transactions recorded.</p>
                ) : (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Book</th>
                                    <th>User</th>
                                    <th>Type</th>
                                    <th>Quantity</th>
                                    <th>Date</th>
                                </tr>
                            </thead>

                            <tbody>
                                {transactions.map((transaction) => (
                                    <tr key={transaction.id}>
                                        <td>{transaction.book}</td>

                                        <td>
                                            {transaction.user_name ||
                                                "System"}
                                        </td>

                                        <td>
                                            <span
                                                className={
                                                    transaction.type ===
                                                    "BORROW"
                                                        ? "transaction-borrow"
                                                        : "transaction-stock"
                                                }
                                            >
                                                {transaction.type === "BORROW" ? "BORROW" : "STOCK IN"}
                                            </span>
                                        </td>

                                        <td>
                                            {transaction.quantity}
                                        </td>

                                        <td>
                                            {new Date(
                                                transaction.transaction_date
                                            ).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </section>
    );
}

export default Transactions;