import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Contexts/AuthContext';
import CanLoad from '../Components/CanLoad';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { signIn } = useAuth();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            setIsLoading(true);
            await signIn(email, password);
            setIsLoading(false);
            navigate('/');
        } catch (error) {
            setIsLoading(false);
            setError(error.message);
        }
    };

    const handleCreateAccount = () => {
        navigate('/signup');
    };

    return (
        <div className="cover-page flex-column-start">
            <h1 className='login-logo'>😈</h1>
            <h1 className='no-margin margin-bottom-20'>Purple Devil AI</h1>
            <div className='mobile-width'>
                <CanLoad isLoading={isLoading}>
                    <form className='max-width' onSubmit={handleSubmit}>
                        <h2 className='login-title'>Login</h2>
                        {error && <p className="error">{error}</p>}
                        <div>
                            <input
                                className='text-input-style margin-bottom'
                                type='email'
                                placeholder='Email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <input
                                className='text-input-style margin-bottom'
                                type='password'
                                placeholder='Password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <button className="button-style primary-button-color margin-bottom max-width margin-top-20" type="submit">Login</button>
                        </div>
                        <div>
                            <button className="button-style secondary-button-color max-width margin-top-20" type="button" onClick={handleCreateAccount}>Create Account</button>
                        </div>
                    </form>
                </CanLoad>
            </div>
        </div>
    );
};

export default LoginPage;
