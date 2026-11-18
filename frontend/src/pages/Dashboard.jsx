import { useEffect, useState } from "react";
import {
    getBooks,
    getUsers,
    getTransactions
} from "../api";

function Dashboard() {
    const [books, setBooks] = useState([]);
    const [users, setUsers] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadDashboard() {
            try {
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
                setError("Unable to load dashboard data.");
            } finally {
                setLoading(false);
            }
        }

        loadDashboard();
    }, []);

    const totalCopies = books.reduce(
        (total, book) => total + book.quantity,
        0
    );

    const lowStockBooks = books.filter(
        (book) => book.quantity < 2
    );

    if (loading) {
        return (
            <section>
                <div className="page-title">
                    <h1>Dashboard</h1>
                    <p>Loading library data...</p>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section>
                <div className="page-title">
                    <h1>Dashboard</h1>
                    <p>{error}</p>
                </div>
            </section>
        );
    }

    return (
        <section>
            <div className="page-title">
                <div>
                    <h1>Dashboard</h1>
                    <p>Overview of the library system.</p>
                </div>

                <div className="system-status">
                    <span className="status-dot"></span>
                    SYSTEM ONLINE
                </div>
            </div>

            <div className="dashboard-cards">
                <div className="dashboard-card">
                    <h3>Books</h3>
                    <strong>{books.length}</strong>
                    <p>Titles in library</p>
                </div>

                <div className="dashboard-card">
                    <h3>Users</h3>
                    <strong>{users.length}</strong>
                    <p>Registered users</p>
                </div>

                <div className="dashboard-card">
                    <h3>Available Copies</h3>
                    <strong>{totalCopies}</strong>
                    <p>Total copies available</p>
                </div>

                <div className="dashboard-card warning-card">
                    <h3>Low Stock</h3>
                    <strong>{lowStockBooks.length}</strong>
                    <p>Books with fewer than 2 copies</p>
                </div>
            </div>

            <div className="dashboard-section">
                <h2>Low Stock Books</h2>

                {lowStockBooks.length === 0 ? (
                    <p>No books are currently low in stock.</p>
                ) : (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Author</th>
                                    <th>Genre</th>
                                    <th>Quantity</th>
                                </tr>
                            </thead>

                            <tbody>
                                {lowStockBooks.map((book) => (
                                    <tr key={book.id} className="low-stock">
                                        <td>{book.title}</td>
                                        <td>{book.author}</td>
                                        <td>{book.genre}</td>
                                        <td>{book.quantity}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div className="dashboard-section">
                <h2>Recent Transactions</h2>

                {transactions.length === 0 ? (
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
                                {transactions.slice(0, 5).map((transaction) => (
                                    <tr key={transaction.id}>
                                        <td>{transaction.book}</td>
                                        <td>
                                            {transaction.user_name || "System"}
                                        </td>
                                        <td>{transaction.type}</td>
                                        <td>{transaction.quantity}</td>
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

export default Dashboard;