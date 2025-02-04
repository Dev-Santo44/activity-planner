import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import SignIn from "./components/SignIn";
import Dashboard from "./components/Dashboard";
import { onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import SignUp from "./components/SIgnUp";
import { auth } from "./firebase/firebase";
import Navbar from "./components/Navbar";
const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <><Navbar /><Navigate to="/dashboard" /></> : <><Navbar /><SignIn /></>} />
        <Route path="/signup" element={user ? <><Navbar /><Navigate to="/dashboard" /></> : <><Navbar /><SignUp /></>} />
        <Route path="/dashboard" element={user ? <><Navbar /><Dashboard /></>: <Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;