import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Contexts/AuthContext';
import { useUser } from '../Contexts/UserContext';
import CanLoad from '../Components/CanLoad';
import { getStripeCheckoutSessionId } from '../Services/StripeCheckoutService';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51PUjYSHwBaJXHYbw16oacLteUMsaUiMKb4YM5pcbsXG7klvw9mjrEycRQhRIRKNRFyNxczLyJvpYoIPMMRzF3cPm00tLg3CCgx');

const HomePage = () => {

    const { accessToken } = useAuth();
    const { user, fetchUser } = useUser();
    const [fetchingSessionId, setFetchingSessionId] = useState(false);
    const [fetchingSessionIdError, setFetchingSessionIdError] = useState('');


    useEffect(() => {
        if (!user) {
            fetchUser();
        }
    }, [user, fetchUser]);

    const handleSetUpPayment = async () => {
        try {
            setFetchingSessionId(true);
            const sessionId = await getStripeCheckoutSessionId(accessToken);
            const stripe = await stripePromise;
            const { error } = await stripe.redirectToCheckout({ sessionId: sessionId });
            if (error) {
                setFetchingSessionIdError(error.message);
            }
            setFetchingSessionId(false);

        } catch (error) {
            setFetchingSessionId(false);
            setFetchingSessionIdError(error.message);
        }
    };

    return (
        <CanLoad isLoading={!user}>
            <div className="cover-page flex-column-start">
                <h1 className='home-logo no-margin margin-top-20'>😈</h1>
                <h3 className='no-margin margin-bottom-20'>Purple Devil AI</h3>
                <div className='mobile-width'>
                    <div className='max-width'>
                        {user && (
                            <div className='flex-column-start-right'>
                                <h2>Welcome, {user.first_name}!</h2>
                                <p className='margin-bottom'>Let's build something.</p>
                                <div className='max-width'>
                                    {!user.has_payment_set_up && (
                                        <CanLoad isLoading={fetchingSessionId}>
                                            <div className='max-width'>
                                                {fetchingSessionIdError && <p className='error'>{fetchingSessionIdError}</p>}
                                                <button className='button-style primary-button-color max-width margin-top-20' onClick={handleSetUpPayment}>Set Up Payment</button>
                                            </div>
                                        </CanLoad>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </CanLoad>
    )
};

export default HomePage;