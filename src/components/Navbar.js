import React from 'react';
import { signOut } from "firebase/auth";
import { auth } from "./../firebase/firebase";
import './Dashboard.css';
import { Link } from 'react-router-dom';

import { onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";

function Navbar() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);
    return (
        <div className='Nav-con'>
            <header>
                <h1>Welcome to Your Activity Planner</h1>
            </header>
            <nav>
                <Link to="/">Home</Link>
                {user ? <button onClick={() => signOut(auth)} className="bg-gray-500 text-white p-2 rounded mt-4">Sign Out</button>:<><Link to="/">Login</Link>
                <Link to="/signup">Register</Link></>}
                
            </nav>
        </div>
    )
}

export default Navbar
