import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

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
    console.log('\n🔔 NEW REQUEST RECEIVED');
    console.log('Request body:', JSON.stringify(req.body, null, 2));

    try {
        const { amount, currency, feeId, studentName, feeType } = req.body;

        const numAmount = parseFloat(amount);
        console.log('Amount received:', amount, 'Type:', typeof amount);
        console.log('Parsed amount:', numAmount);

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

        console.log('✅ Creating Stripe session...');

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
            success_url: `http://localhost:5173/dashboard/parent?payment=success&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `http://localhost:5173/dashboard/parent?payment=cancelled`,
            metadata: {
                feeId: String(feeId || ''),
                studentName: String(studentName || ''),
                feeType: String(feeType || ''),
            },
        });

        console.log('✅ Session created successfully!');
        console.log('Session ID:', session.id);

        res.json({
            sessionId: session.id,
            url: session.url
        });

    } catch (error) {
        console.error('\n❌ ERROR OCCURRED:');
        console.error('Message:', error.message);
        console.error('Type:', error.type);
        console.error('Code:', error.code);
        console.error('Param:', error.param);
        console.error('Stack:', error.stack);

        res.status(500).json({
            error: error.message,
            type: error.type,
            code: error.code
        });
    }
});

const PORT = process.env.PORT || 4242;

app.listen(PORT, () => {
    console.log(`\n✅ Payment server running on port ${PORT}`);
    console.log(`💳 Stripe integration active`);
    console.log(`🔗 Test: http://localhost:${PORT}/health\n`);
});
