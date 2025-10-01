import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <Link className="navbar-brand" to="/">GiftLink</Link>

            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                    {/* Task 1: Add links to Home and Gifts below*/}
                    <li className="nav-item">
                        <Link className="nav-link" to="/">Home</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/main">Gifts</Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}
