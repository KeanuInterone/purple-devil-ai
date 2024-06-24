import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useAuth } from '../Contexts/AuthContext';
import { useUser } from '../Contexts/UserContext';
import { confirmStripeCheckoutSession } from '../Services/StripeCheckoutService';
import CanLoad from '../Components/CanLoad';

const ConfirmPaymentSetUpPage = () => {
    const { accessToken } = useAuth();
    const { fetchUser } = useUser();
    const { session_id } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const confirmPaymentSetUp = async () => {
            try {
                setIsLoading(true);
                await confirmStripeCheckoutSession(accessToken, session_id);
                await fetchUser();
                setIsLoading(false);
                navigate('/');
            } catch (error) {
                setIsLoading(false);
                setError(error.message);
            }
        };

        confirmPaymentSetUp();
    }, []);

    return (
        <div className="cover-page flex-column-start">
            <h1 className='home-logo no-margin margin-top-20'>😈</h1>
            <h3 className='no-margin margin-bottom-20'>Confirm Payment Setup</h3>
            <div className="mobile-width">
                <div className="flex-column-center max-width">
                    {error && (
                        <div className='max-width'>
                            <p className="error">{error}</p>
                            <button className='button-style primary-button-color max-width margin-top-20'>Back</button>
                        </div>
                    )}
                    {isLoading && (
                        <CanLoad isLoading={isLoading}>
                            <div style={{height: '100px', width: '100px'}}></div>
                        </CanLoad>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ConfirmPaymentSetUpPage;