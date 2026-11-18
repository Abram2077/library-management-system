import { useEffect, useState } from "react";
import {
    getUsers,
    addUser,
    updateUser,
    deleteUser
} from "../api";

const emptyForm = {
    name: "",
    membership_id: "",
    role: "member"
};

function Users() {
    const [users, setUsers] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    async function loadUsers() {
        try {
            setLoading(true);

            const data = await getUsers();

            setUsers(data);
        } catch (error) {
            console.error(error);
            setError("Unable to load users.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadUsers();
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

        if (!form.name.trim() || !form.membership_id.trim()) {
            setError("Name and membership ID are required.");
            return;
        }

        const userData = {
            name: form.name.trim(),
            membership_id: form.membership_id.trim(),
            role: form.role
        };

        try {
            if (editingId) {
                await updateUser(editingId, userData);
                setMessage("User updated successfully.");
            } else {
                await addUser(userData);
                setMessage("User added successfully.");
            }

            resetForm();
            await loadUsers();
        } catch (error) {
            console.error(error);
            setError(
                editingId
                    ? "Failed to update user."
                    : "Failed to add user."
            );
        }
    }

    function handleEdit(user) {
        setEditingId(user.id);

        setForm({
            name: user.name,
            membership_id: user.membership_id,
            role: user.role
        });

        setMessage("");
        setError("");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    async function handleDelete(id) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this user?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await deleteUser(id);

            setMessage("User deleted successfully.");

            if (editingId === id) {
                resetForm();
            }

            await loadUsers();
        } catch (error) {
            console.error(error);
            setError("Failed to delete user.");
        }
    }

    return (
        <section>
            <div className="page-title">
                <h1>User Management</h1>
                <p>
                    Manage library members and their roles.
                </p>
            </div>

            <div className="form-card">
                <h2>
                    {editingId ? "Update User" : "Add New User"}
                </h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Name</label>

                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Enter user's name"
                            />
                        </div>

                        <div className="form-group">
                            <label>Membership ID</label>

                            <input
                                type="text"
                                name="membership_id"
                                value={form.membership_id}
                                onChange={handleChange}
                                placeholder="e.g. L003"
                            />
                        </div>

                        <div className="form-group">
                            <label>Role</label>

                            <select
                                name="role"
                                value={form.role}
                                onChange={handleChange}
                            >
                                <option value="member">
                                    Member
                                </option>

                                <option value="admin">
                                    Admin
                                </option>
                            </select>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            type="submit"
                            className="primary-button"
                        >
                            {editingId
                                ? "Update User"
                                : "Add User"}
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
                    <h2>Registered Users</h2>

                    <span>
                        {users.length} users
                    </span>
                </div>

                {loading ? (
                    <p>Loading users...</p>
                ) : users.length === 0 ? (
                    <p>No users found.</p>
                ) : (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Membership ID</th>
                                    <th>Role</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.name}</td>

                                        <td>
                                            {user.membership_id}
                                        </td>

                                        <td>
                                            <span className="role-badge">
                                                {user.role}
                                            </span>
                                        </td>

                                        <td>
                                            <div className="action-buttons">
                                                <button
                                                    className="edit-button"
                                                    onClick={() =>
                                                        handleEdit(user)
                                                    }
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    className="delete-button"
                                                    onClick={() =>
                                                        handleDelete(
                                                            user.id
                                                        )
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

export default Users;