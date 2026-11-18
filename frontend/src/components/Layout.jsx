import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

function Layout() {
    return (
        <>
            <Navbar />

            <main className="main-content">
                <Outlet />
            </main>

            <footer className="app-footer">
                <span>LIBRARY // SYSTEM</span>
                <span>WEB APPLICATION</span>
            </footer>
        </>
    );
}

export default Layout;