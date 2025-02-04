import React, { useState } from "react";
import './Login.css'
import GoogleCover from './../assets/google_cover.jpg'
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase/firebase";
import { Link, useNavigate } from "react-router-dom";

const SignIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSignIn = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/dashboard");
        } catch (err) {
            setError(err.message);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            navigate("/dashboard");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="flex flex-col items-center mt-10">
            <div className="login-container">
            <h1 className="text-2xl mb-4">Sign In</h1>
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleSignIn} className="flex flex-col gap-4">
                <label for="email">Email</label>
                <input
                    id="email"
                    type="email"
                    placeholder="Enter your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border rounded p-2"
                />
                <label for="password">Password</label>
                <input
                    id="password"
                    type="password"
                    placeholder="Enter your Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border rounded p-2"
                />
                <button type="submit" className="bg-blue-500 text-white p-2 rounded">Sign In</button>
            </form>
            <p>Don't have an account <Link to={'/signup'}>Sign up here</Link></p>

            <button
                onClick={handleGoogleSignIn}
                className="bg-red-500 text-white p-2 rounded mt-4"
            >
                <img src={GoogleCover}  alt="google-cover"/>
                
            </button>
            <p>Sign In with Google here...</p>

            </div>
        </div>
    );
};

export default SignIn;