import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../Contexts/AuthContext';
import CanLoad from '../Components/CanLoad';

const ConfirmSignUpPage = () => {
    const [confirmationCode, setConfirmationCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || '';
    const { confirmSignUp } = useAuth();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            setIsLoading(true);
            await confirmSignUp(email, confirmationCode);
            setIsLoading(false);
            navigate('/login');
        } catch (error) {
            setIsLoading(false);
            setError(error.message);
        }
    };

    return (
        <div className="cover-page flex-column-start">
            <h1 className='login-logo'>😈</h1>
            <h1 className='no-margin margin-bottom-20'>Purple Devil AI</h1>
            <div className="mobile-width">
                <div className="max-width">
                    <CanLoad isLoading={isLoading}>
                        <form onSubmit={handleSubmit}>
                            <h2>Confirm Sign Up</h2>
                            <p>A code was sent to {email}</p>
                            {error && <p className="error">{error}</p>}
                            <div>
                                <input
                                    className='text-input-style margin-bottom'
                                    placeholder='Confirmation Code'
                                    type="text"
                                    value={confirmationCode}
                                    onChange={(e) => setConfirmationCode(e.target.value)}
                                    required
                                />
                            </div>
                            <button className='button-style primary-button-color max-width margin-top-20'>Confirm</button>
                        </form>
                    </CanLoad>
                </div>
            </div>
        </div>
    );
};

export default ConfirmSignUpPage;
