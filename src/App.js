import './App.css';
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './Contexts/AuthContext';
import LoginPage from './Pages/LoginPage';
import SignUpPage from './Pages/SignUpPage';
import ConfirmSignUpPage from './Pages/ConfirmSignUpPage';

function App() {
    const { isAuthenticated } = useAuth();


    return (
        <div className="app">
            <Router>
                <div>
                    <Routes>
                        <Route
                            path="/login"
                            element={<LoginPage />}
                        />
                        <Route
                            path="/signup"
                            element={<SignUpPage />}
                        />
                        <Route
                            path="/confirm-sign-up"
                            element={<ConfirmSignUpPage />}
                        />
                    </Routes>
                </div>
            </Router>
        </div>
    );
}

export default App;
