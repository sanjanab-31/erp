# 🔐 Fixing Email Authentication

The error `535-5.7.8 Username and Password not accepted` means Google blocked the login.

### 🛑 STOP using your Gmail Login Password!
Google **blocks** regular passwords for security. You **MUST** use an **App Password**.

## ✅ Step-by-Step Fix

1.  **Go to Google Account Security**:
    -   Link: [https://myaccount.google.com/security](https://myaccount.google.com/security)
    -   Login to `sanjana.b2024cse@sece.ac.in`.

2.  **Enable 2-Step Verification** (if not on):
    -   Look for "2-Step Verification" section. Turn it **ON**.

3.  **Generate App Password**:
    -   Search "App passwords" in the top search bar of the Google Account page.
    -   OR Go to: `Security` > `2-Step Verification` (scroll down) > `App passwords`.
    -   **App name**: Enter `ERP`.
    -   Click **Create**.

4.  **Copy the 16-Character Code**:
    -   It will look like: `xxxx yyyy zzzz wwww`.
    -   **Copy this code.**

5.  **Update Config**:
    -   Open `backend/.env`.
    -   Update `SMTP_PASSWORD`:
        ```env
        SMTP_PASSWORD=xxxx yyyy zzzz wwww
        ```
    -   (Our code now automatically removes spaces, so you can paste it exactly as is).

6.  **Retest**:
    -   Run: `node test-email.js`
