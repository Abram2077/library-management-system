import { NavLink, useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();

    const currentUser = JSON.parse(
        localStorage.getItem("currentUser")
    );

    function handleLogout() {
        localStorage.removeItem("currentUser");
        navigate("/login");
    }

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <h2>LIBRARY // SYSTEM</h2>
            </div>

            <div className="navbar-links">
                <NavLink to="/dashboard">Dashboard</NavLink>
                <NavLink to="/books">Books</NavLink>
                {currentUser?.role === "admin" && (
                    <NavLink to="/users">Users</NavLink>
                )}
                <NavLink to="/transactions">Transactions</NavLink>

                {currentUser && (
                    <span className="welcome-user">
                        {currentUser.name} ({currentUser.role})
                    </span>
                )}

                <button
                    className="logout-button"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>
        </nav>
    );
}

export default Navbar;