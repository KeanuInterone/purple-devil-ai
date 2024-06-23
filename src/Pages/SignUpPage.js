import React, { useState } from 'react';
import { useAuth } from '../Contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import IconButton from '../Components/IconButton';
import CanLoad from '../Components/CanLoad';

const SignUpPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { signUp } = useAuth();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            setIsLoading(true);
            await signUp(email, password, firstName, lastName);
            setIsLoading(false);
            navigate('/confirm-sign-up', { state: { email } });
        } catch (error) {
            setIsLoading(false);
            setError(error.message);
        }
    };

    return (
        <div className="cover-page flex-column-start">
            <IconButton
                iconPath="/icons/back_arrow.png"
                className="back-icon"
                onPressed={() => navigate('/login')} />
            <h1 className='login-logo'>😈</h1>
            <h1 className='no-margin margin-bottom-20'>Purple Devil AI</h1>
            <div className="mobile-width">
                <div classname="max-width">
                    <CanLoad isLoading={isLoading}>
                        <form onSubmit={handleSubmit}>
                            <h2>Sign Up</h2>
                            {error && <p className="error">{error}</p>}
                            <div>
                                <input
                                    className='text-input-style margin-bottom'
                                    type="email"
                                    placeholder='Email'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <input
                                    className='text-input-style margin-bottom'
                                    type="password"
                                    placeholder='Password'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <input
                                    className='text-input-style margin-bottom'
                                    type="text"
                                    placeholder='First Name'
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <input
                                    className='text-input-style margin-bottom'
                                    type="text"
                                    placeholder='Last Name'
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    required
                                />
                            </div>
                            <button className='button-style primary-button-color max-width margin-top-20' type="submit">Sign Up</button>
                        </form>
                    </CanLoad>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;
