import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { Link, useNavigate } from "react-router-dom";
import './Login.css'
const SignUp = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            navigate("/dashboard");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="flex flex-col items-center mt-10">
            <div className="login-container">
            <h1 className="text-2xl mb-4">Sign Up</h1>
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleSignUp} className="flex flex-col gap-4">
                <label for="email">Email</label>
                <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border rounded p-2"
                />
                <label for="password">Password</label>
                <input
                    type="password"
                    id="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border rounded p-2"
                />
                <button type="submit" className="bg-green-500 text-white p-2 rounded">Sign Up</button>
            </form>
            <p>Already have an account <Link to={'/'}>Sign In here</Link></p>
            </div>
        </div>
    );
};

export default SignUp;