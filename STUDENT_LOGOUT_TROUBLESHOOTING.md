# 🔧 Student Logout Troubleshooting Guide

## Issue
Cannot logout from Student portal Settings page.

## Solution Applied

### **Added Console Logging**
The logout function now logs to the browser console to help debug:

```javascript
const handleLogout = () => {
    console.log('Logout clicked - Student Portal');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('token');
    console.log('LocalStorage cleared, navigating to login...');
    navigate('/login');
};
```

---

## How to Test

### **Step 1: Open Browser Console**
1. Go to Student Portal
2. Press `F12` or `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)
3. Click on "Console" tab

### **Step 2: Go to Settings**
1. Click "Settings" in the sidebar
2. Look for the **Logout** button in the top-right of the tabs section

### **Step 3: Click Logout**
1. Click the red "Logout" button
2. Check the console for messages:
   - ✅ "Logout clicked - Student Portal"
   - ✅ "LocalStorage cleared, navigating to login..."
3. You should be redirected to `/login`

---

## Possible Issues & Solutions

### **Issue 1: Button Not Visible**
**Symptom:** Can't see the logout button

**Solution:**
- The button is in the tabs row, aligned to the right
- Scroll horizontally if needed
- Look for a red button with a logout icon

### **Issue 2: Button Visible But Not Clickable**
**Symptom:** Button is there but clicking does nothing

**Check Console:**
- If you see "Logout clicked - Student Portal" → Function is working
- If you don't see any message → Button click not registering

**Possible Causes:**
- Z-index issue (another element covering it)
- Event handler not attached
- JavaScript error preventing execution

### **Issue 3: Redirects But Can Still Access Portal**
**Symptom:** Goes to login but can navigate back to portal

**Solution:**
- Check if `isAuthenticated` is being set again somewhere
- Check protected route logic in `App.jsx`
- Verify all localStorage items are cleared

### **Issue 4: Console Shows Error**
**Symptom:** Error message in console when clicking logout

**Common Errors:**
1. **"navigate is not a function"**
   - Check if `useNavigate` is imported
   - Check if component is inside `<Router>`

2. **"Cannot read property 'removeItem' of undefined"**
   - localStorage is not available
   - Check browser settings

---

## Verification Checklist

After clicking logout, verify:

- [ ] Console shows "Logout clicked - Student Portal"
- [ ] Console shows "LocalStorage cleared, navigating to login..."
- [ ] Redirected to `/login` page
- [ ] Cannot access student portal without logging in again
- [ ] localStorage items are cleared:
  - `isAuthenticated`
  - `userRole`
  - `userEmail`
  - `userName`
  - `token`

---

## Check LocalStorage

### **Before Logout:**
1. Open Console
2. Type: `localStorage`
3. Expand to see all items
4. Should see: `isAuthenticated`, `userRole`, etc.

### **After Logout:**
1. Check `localStorage` again
2. Those items should be **gone**

---

## Button Location

The logout button is located in the **Settings page tabs section**:

```
Settings Page
┌────────────────────────────────────────────────────┐
│ Settings                                           │
│ Manage your account settings and preferences      │
├────────────────────────────────────────────────────┤
│ [Profile] [Notifications] [Security] ... [Logout] │ ← Here!
│                                            ↑       │
│                                     Red button     │
└────────────────────────────────────────────────────┘
```

---

## If Still Not Working

### **Try This:**
1. **Hard Refresh:** `Ctrl+Shift+R` (Windows) / `Cmd+Shift+R` (Mac)
2. **Clear Browser Cache**
3. **Check if file saved:** Verify `SettingsPage.jsx` has the latest changes
4. **Restart Dev Server:** Stop and restart `npm run dev`

### **Check File:**
Open: `src/components/portals/student/SettingsPage.jsx`

**Line 49-57 should be:**
```javascript
const handleLogout = () => {
    console.log('Logout clicked - Student Portal');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('token');
    console.log('LocalStorage cleared, navigating to login...');
    navigate('/login');
};
```

**Line 720-727 should be:**
```javascript
{/* Logout Button */}
<button
    onClick={handleLogout}
    className="ml-auto flex items-center space-x-2 px-6 py-3 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors whitespace-nowrap"
>
    <LogOut className="w-4 h-4" />
    <span>Logout</span>
</button>
```

---

## Expected Console Output

When you click logout, you should see:

```
Logout clicked - Student Portal
LocalStorage cleared, navigating to login...
```

If you see this, the function is working correctly!

---

## Contact

If the issue persists after trying all the above:
1. Share the console error message
2. Share a screenshot of the Settings page
3. Confirm if the button is visible

The logout functionality is implemented and should work. The console logs will help identify where the issue is occurring.
