import { loadStripe } from '@stripe/stripe-js';

// Replace with your actual Stripe publishable key
// Get it from: https://dashboard.stripe.com/test/apikeys
const stripePromise = loadStripe('pk_test_51SeqXZGwQi5RLnDThhAPcctzcxHTZdUtrGSSTYt48vr2I6rOZJc98b3fV9WJwlWpw4QD8IfwkQjXbht3Uf5uHVtQ00sKykAhzR');

export const PAYMENT_SERVER_URL = 'http://localhost:4242';

export const getStripe = () => stripePromise;

// Create Checkout Session (redirect to Stripe)
export const createCheckoutSession = async (amount, feeId, studentName, feeType) => {
    try {
        const response = await fetch(`${PAYMENT_SERVER_URL}/create-checkout-session`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount,
                currency: 'inr',
                feeId,
                studentName,
                feeType
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to create checkout session');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error creating checkout session:', error);
        throw error;
    }
};

// Get checkout session details
export const getCheckoutSession = async (sessionId) => {
    try {
        const response = await fetch(`${PAYMENT_SERVER_URL}/checkout-session/${sessionId}`);

        if (!response.ok) {
            throw new Error('Failed to get checkout session');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error getting checkout session:', error);
        throw error;
    }
};

export default {
    getStripe,
    createCheckoutSession,
    getCheckoutSession
};
