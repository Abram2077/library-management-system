const API_URL = "http://localhost:5000";

// Books
export async function getBooks() {
    const response = await fetch(`${API_URL}/books`);

    if (!response.ok) {
        throw new Error("Failed to fetch books");
    }

    return response.json();
}

export async function addBook(book) {
    const response = await fetch(`${API_URL}/books`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(book)
    });

    if (!response.ok) {
        throw new Error("Failed to add book");
    }

    return response.json();
}

export async function updateBook(id, book) {
    const response = await fetch(`${API_URL}/books/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(book)
    });

    if (!response.ok) {
        throw new Error("Failed to update book");
    }

    return response.json();
}

export async function deleteBook(id) {
    const response = await fetch(`${API_URL}/books/${id}`, {
        method: "DELETE"
    });

    if (!response.ok) {
        throw new Error("Failed to delete book");
    }

    return response.json();
}

// Users
export async function getUsers() {
    const response = await fetch(`${API_URL}/users`);

    if (!response.ok) {
        throw new Error("Failed to fetch users");
    }

    return response.json();
}

export async function addUser(user) {
    const response = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    });

    if (!response.ok) {
        throw new Error("Failed to add user");
    }

    return response.json();
}

export async function updateUser(id, user) {
    const response = await fetch(`${API_URL}/users/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    });

    if (!response.ok) {
        throw new Error("Failed to update user");
    }

    return response.json();
}

export async function deleteUser(id) {
    const response = await fetch(`${API_URL}/users/${id}`, {
        method: "DELETE"
    });

    if (!response.ok) {
        throw new Error("Failed to delete user");
    }

    return response.json();
}

// Transactions
export async function getTransactions() {
    const response = await fetch(`${API_URL}/transactions`);

    if (!response.ok) {
        throw new Error("Failed to fetch transactions");
    }

    return response.json();
}

export async function createTransaction(transaction) {
    const response = await fetch(`${API_URL}/transactions`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(transaction)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Transaction failed");
    }

    return data;
}

// Authentication
export async function loginUser(membership_id) {
    const response = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ membership_id })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Login failed");
    }

    return data;
}