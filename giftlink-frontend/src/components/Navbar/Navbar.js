import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
    const { isLoggedIn, setIsLoggedIn, userName, setUserName } = useAppContext();
    const navigate = useNavigate();

    useEffect(() => {
        const authToken = sessionStorage.getItem('auth-token');
        const name = sessionStorage.getItem('name');

        if (authToken && name) {
            setIsLoggedIn(true);
            setUserName(name);
        }
    }, [setIsLoggedIn, setUserName]);

    const handleLogout = () => {
        sessionStorage.clear();
        setIsLoggedIn(false);
        setUserName('');
        navigate('/app');
    };

    const handleProfileClick = () => {
        navigate('/app/profile');
    };

    return (
        <nav className="navbar navbar-expand-lg modern-navbar">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/app">
                    🎁 GiftLink
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">
                                Home
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/app">
                                Gifts
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/app/search">
                                Search
                            </Link>
                        </li>
                    </ul>

                    <ul className="navbar-nav ms-auto">
                        {isLoggedIn ? (
                            <>
                                <li className="nav-item">
                                    <span
                                        className="nav-link welcome-message"
                                        onClick={handleProfileClick}
                                    >
                                        👋 Welcome, {userName}
                                    </span>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className="btn logout-btn"
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link login-btn" to="/app/login">
                                        Login
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link register-btn" to="/app/register">
                                        Register
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}