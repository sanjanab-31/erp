@echo off
echo ========================================
echo Stripe Environment Setup
echo ========================================
echo.
echo IMPORTANT: Never share your Stripe keys!
echo.
echo This script will help you create your .env file.
echo You'll need to get your keys from Stripe Dashboard:
echo https://dashboard.stripe.com/test/apikeys
echo.
pause
echo.

set /p SECRET_KEY="Enter your Stripe SECRET key (sk_test_...): "
set /p PORT="Enter port for payment server (default 4242): "

if "%PORT%"=="" set PORT=4242

echo.
echo Creating .env file...
echo.

(
echo STRIPE_SECRET_KEY=%SECRET_KEY%
echo PORT=%PORT%
) > .env

echo.
echo ========================================
echo .env file created successfully!
echo ========================================
echo.
echo REMEMBER:
echo 1. Never commit the .env file to git
echo 2. Never share your secret key
echo 3. Use test keys for development
echo 4. The .env file is already in .gitignore
echo.
echo Next steps:
echo 1. Update frontend/src/utils/stripeConfig.js with your PUBLISHABLE key
echo 2. Run: npm run dev:all
echo.
pause
