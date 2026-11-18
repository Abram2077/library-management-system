import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout";
import ProtectedRoute from "./ProtectedRoute";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Books from "./pages/Books";
import Users from "./pages/Users";
import Transactions from "./pages/Transactions";

function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />

            <Route element={<ProtectedRoute />}>
                <Route element={<Layout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/books" element={<Books />} />
                    <Route path="/transactions" element={<Transactions />} />

                    <Route element={<ProtectedRoute requiredRole="admin" />}>
                        <Route path="/users" element={<Users />} />
                    </Route>
                </Route>
            </Route>

            <Route
                path="*"
                element={<Navigate to="/dashboard" replace />}
            />
        </Routes>
    );
}

export default App;