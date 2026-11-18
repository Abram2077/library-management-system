import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api";

function Login() {
    const navigate = useNavigate();

    const [membershipId, setMembershipId] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");

        if (!membershipId.trim()) {
            setError("Please enter your membership ID.");
            return;
        }

        try {
            setLoading(true);

            const data = await loginUser(membershipId.trim());

            localStorage.setItem(
                "currentUser",
                JSON.stringify(data.user)
            );

            navigate("/dashboard");
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="login-page">
            <div className="login-card">
                <h1>Library Management</h1>

                <p className="login-subtitle">
                    Sign in to access the library system.
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Membership ID</label>

                        <input
                            type="text"
                            value={membershipId}
                            onChange={(event) =>
                                setMembershipId(event.target.value)
                            }
                            placeholder="e.g. L001"
                        />
                    </div>

                    <button
                        type="submit"
                        className="primary-button login-button"
                        disabled={loading}
                    >
                        {loading ? "Signing in..." : "Login"}
                    </button>
                </form>

                {error && (
                    <p className="error-message">
                        {error}
                    </p>
                )}

                <div className="login-help">
                    <p>Test accounts:</p>
                    <p>L001 — Admin</p>
                    <p>L002 — Member</p>
                </div>
            </div>
        </section>
    );
}

export default Login;