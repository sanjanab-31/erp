import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.use(cors());
app.use(express.json());

console.log('🚀 Payment server starting...');
console.log('📍 Stripe key loaded:', process.env.STRIPE_SECRET_KEY ? 'Yes' : 'No');

app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Payment server is running',
        mode: 'test'
    });
});

app.post('/create-checkout-session', async (req, res) => {

    try {
        const { amount, currency, feeId, studentName, feeType } = req.body;

        const numAmount = parseFloat(amount);

        if (!numAmount || numAmount <= 0 || isNaN(numAmount)) {
            console.error('❌ Invalid amount');
            return res.status(400).json({ error: 'Invalid amount' });
        }

        if (numAmount < 50) {
            console.error('❌ Amount too small for Stripe');
            return res.status(400).json({
                error: 'Minimum payment amount is ₹50. Stripe requires at least 50 cents.'
            });
        }

        console.log('✅ Creating Stripe session for:', {
            feeId,
            studentName,
            amount: numAmount
        });

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: currency || 'inr',
                    product_data: {
                        name: `${feeType || 'Fee'} - ${studentName || 'Student'}`,
                        description: `Fee payment for ${studentName || 'Student'}`,
                    },
                    unit_amount: Math.round(numAmount * 100),
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `${frontendUrl}/parent/fees?payment=success&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${frontendUrl}/parent/fees?payment=cancelled`,
            metadata: {
                feeId: String(feeId || ''),
                studentName: String(studentName || ''),
                feeType: String(feeType || ''),
            },
        });


        res.json({
            sessionId: session.id,
            url: session.url
        });

    } catch (error) {
        console.error('❌ STRIPE ERROR:', error.message);
        if (error.type === 'StripeAuthenticationError') {
            console.error('👉 Check your STRIPE_SECRET_KEY in payment-server/.env');
        }

        res.status(500).json({
            error: error.message,
            stripeError: true
        });
    }
});

app.get('/checkout-session/:sessionId', async (req, res) => {
    try {
        const { sessionId } = req.params;
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        console.log('🔍 Retrieved session for verification:', {
            id: session.id,
            status: session.payment_status,
            feeId: session.metadata?.feeId
        });
        res.json(session);
    } catch (error) {
        console.error('❌ GET SESSION ERROR:', error.message);
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 4242;

app.listen(PORT, () => {
    console.log(`\n✅ Payment server running on port ${PORT}`);
    console.log(`💳 Stripe integration active`);
    console.log(`🔗 Test: http://localhost:${PORT}/health\n`);
});
