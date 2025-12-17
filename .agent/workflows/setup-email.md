# 📧 Email Setup & Troubleshooting

The error `535-5.7.8` means **Google Rejected the Credentials**.

## 🛑 Common Issues
1.  **Using Regular Password**: You MUST use an **App Password** (16 characters).
2.  **School/Work Accounts**: Domains like `@sece.ac.in` usually **BLOCK** App Passwords.
    *   **Solution**: Use a personal `@gmail.com` account for testing.

## ✅ How to Fix

### Option 1: Try a Personal Gmail (Recommended)
1.  Open `backend/.env`.
2.  Change `SMTP_EMAIL` to your **personal** gmail (e.g., `john.doe@gmail.com`).
3.  Generate an App Password for THAT account.
4.  Update `SMTP_PASSWORD`.
5.  Run `node test-email.js`.

### Option 2: Generate App Password Correctly
1.  Go to [Google Security](https://myaccount.google.com/security).
2.  Turn ON **2-Step Verification**.
3.  Search "App passwords".
4.  Create one named "ERP".
5.  Copy the code (e.g., `abcd efgh ijkl mnop`).
6.  Paste into `.env`.

> **Note**: If "App passwords" option is missing, your organization has disabled it. You MUST use a personal account.
