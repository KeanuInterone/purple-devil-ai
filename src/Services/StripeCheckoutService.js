import axios from 'axios';

const getStripeFunctionUrl = () => {
    return "https://nadketb4zg.execute-api.ap-southeast-4.amazonaws.com/v1/stripe";
};

export const getStripeCheckoutSessionId = async (accessToken) => {
    try {
        const response = await axios.post(
            getStripeFunctionUrl(),
            {
                access_token: accessToken,
                function_name: 'create_checkout_session',
            },
        );
        return response.data.session_id;
    } catch (error) {
        console.error('Error fetching Stripe checkout session:', error);
        throw new Error('Error fetching Stripe checkout session.');
    }
};