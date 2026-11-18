import { useEffect, useState } from "react";
import {
    getBooks,
    addBook,
    updateBook,
    deleteBook
} from "../api";

const emptyForm = {
    title: "",
    author: "",
    genre: "",
    isbn: "",
    quantity: ""
};

function Books() {
    const [books, setBooks] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    async function loadBooks() {
        try {
            setLoading(true);
            const data = await getBooks();
            setBooks(data);
        } catch (error) {
            console.error(error);
            setError("Unable to load books.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadBooks();
    }, []);

    function handleChange(event) {
        const { name, value } = event.target;

        setForm((currentForm) => ({
            ...currentForm,
            [name]: value
        }));
    }

    function resetForm() {
        setForm(emptyForm);
        setEditingId(null);
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setMessage("");
        setError("");

        if (
            !form.title.trim() ||
            !form.author.trim() ||
            !form.genre.trim() ||
            !form.isbn.trim() ||
            form.quantity === ""
        ) {
            setError("Please complete all book fields.");
            return;
        }

        if (Number(form.quantity) < 0) {
            setError("Quantity cannot be negative.");
            return;
        }

        const bookData = {
            title: form.title.trim(),
            author: form.author.trim(),
            genre: form.genre.trim(),
            isbn: form.isbn.trim(),
            quantity: Number(form.quantity)
        };

        try {
            if (editingId) {
                await updateBook(editingId, bookData);
                setMessage("Book updated successfully.");
            } else {
                await addBook(bookData);
                setMessage("Book added successfully.");
            }

            resetForm();
            await loadBooks();
        } catch (error) {
            console.error(error);
            setError(
                editingId
                    ? "Failed to update book."
                    : "Failed to add book."
            );
        }
    }

    function handleEdit(book) {
        setEditingId(book.id);

        setForm({
            title: book.title,
            author: book.author,
            genre: book.genre,
            isbn: book.isbn,
            quantity: book.quantity
        });

        setMessage("");
        setError("");
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    async function handleDelete(id) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this book?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await deleteBook(id);
            setMessage("Book deleted successfully.");

            if (editingId === id) {
                resetForm();
            }

            await loadBooks();
        } catch (error) {
            console.error(error);
            setError("Failed to delete book.");
        }
    }

    return (
        <section>
            <div className="page-title">
                <h1>Book Management</h1>
                <p>
                    Add, update, delete and monitor library books.
                </p>
            </div>

            <div className="form-card">
                <h2>
                    {editingId ? "Update Book" : "Add New Book"}
                </h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Title</label>
                            <input
                                type="text"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                placeholder="Enter book title"
                            />
                        </div>

                        <div className="form-group">
                            <label>Author</label>
                            <input
                                type="text"
                                name="author"
                                value={form.author}
                                onChange={handleChange}
                                placeholder="Enter author"
                            />
                        </div>

                        <div className="form-group">
                            <label>Genre</label>
                            <input
                                type="text"
                                name="genre"
                                value={form.genre}
                                onChange={handleChange}
                                placeholder="Enter genre"
                            />
                        </div>

                        <div className="form-group">
                            <label>ISBN</label>
                            <input
                                type="text"
                                name="isbn"
                                value={form.isbn}
                                onChange={handleChange}
                                placeholder="Enter ISBN"
                            />
                        </div>

                        <div className="form-group">
                            <label>Quantity</label>
                            <input
                                type="number"
                                name="quantity"
                                min="0"
                                value={form.quantity}
                                onChange={handleChange}
                                placeholder="Enter quantity"
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="primary-button">
                            {editingId ? "Update Book" : "Add Book"}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                className="secondary-button"
                                onClick={resetForm}
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>

                {message && (
                    <p className="success-message">{message}</p>
                )}

                {error && (
                    <p className="error-message">{error}</p>
                )}
            </div>

            <div className="table-card">
                <div className="section-header">
                    <h2>Library Books</h2>
                    <span>{books.length} titles</span>
                </div>

                {loading ? (
                    <p>Loading books...</p>
                ) : books.length === 0 ? (
                    <p>No books found.</p>
                ) : (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Author</th>
                                    <th>Genre</th>
                                    <th>ISBN</th>
                                    <th>Quantity</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {books.map((book) => (
                                    <tr key={book.id}>
                                        <td>{book.title}</td>
                                        <td>{book.author}</td>
                                        <td>{book.genre}</td>
                                        <td>{book.isbn}</td>
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
                                        <td>
                                            <div className="action-buttons">
                                                <button
                                                    className="edit-button"
                                                    onClick={() =>
                                                        handleEdit(book)
                                                    }
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    className="delete-button"
                                                    onClick={() =>
                                                        handleDelete(book.id)
                                                    }
                                                >
                                                    Delete
                                                </button>
                                            </div>
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

export default Books;