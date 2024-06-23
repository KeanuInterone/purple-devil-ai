import './App.css';
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './Contexts/AuthContext';
import LoginPage from './Pages/LoginPage';
import SignUpPage from './Pages/SignUpPage';
import ConfirmSignUpPage from './Pages/ConfirmSignUpPage';
import HomePage from './Pages/HomePage';

function App() {
    const { isAuthenticated } = useAuth();


    return (
        <div className="app">
            <Router>
                <div>
                    <Routes>
                        <Route
                            path="/login"
                            element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />}
                        />
                        <Route
                            path="/signup"
                            element={isAuthenticated ? <Navigate to="/" /> : <SignUpPage />}
                        />
                        <Route
                            path="/confirm-sign-up"
                            element={isAuthenticated ? <Navigate to="/" /> : <ConfirmSignUpPage />}
                        />
                        <Route
                            path="/"
                            element={isAuthenticated ? <HomePage /> : <Navigate to="/login" />}
                        />
                    </Routes>
                </div>
            </Router>
        </div>
    );
}

export default App;
