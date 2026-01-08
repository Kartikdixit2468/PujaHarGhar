# Network Troubleshooting Guide for PoojaOne

## Issue: "Network request failed" Error

### Root Causes:
1. **Emulator cannot reach backend server**
2. **SERVER_IP in .env points to unreachable IP**
3. **Emulator DNS not configured properly**
4. **Backend server not running or accessible**

---

## Solutions

### Solution 1: Fix Emulator Network Access

#### For Android Emulator:
```bash
# Check if emulator can access your local network
adb shell ping 8.8.8.8

# If ping fails, check emulator settings:
# In Android Studio → AVD Manager → Edit → Advanced Settings
# Set: DNS Servers to: 8.8.8.8, 8.8.4.4
```

### Solution 2: Update SERVER_IP in .env

The current IP `192.168.13.153:3000` may be outdated or unreachable.

#### Find Your Machine's Current IP:
```bash
# On Windows PowerShell:
ipconfig
# Look for IPv4 Address under your active connection (e.g., 192.168.x.x)

# On Mac/Linux:
ifconfig
# Look for inet address
```

#### Update .env:
```env
# Replace with your actual machine IP
SERVER_IP=http://<YOUR_ACTUAL_IP>:3000
```

### Solution 3: Test Backend Connectivity

```bash
# From your development machine, verify backend is running:
curl http://localhost:3000/api/client/user/existing/check

# From emulator (use adb):
adb shell curl http://<YOUR_MACHINE_IP>:3000/api/client/user/existing/check
```

### Solution 4: Use ngrok for Stable URL (Recommended)

If you're having persistent network issues:

```bash
# Install ngrok from https://ngrok.com

# Run your backend on localhost:3000, then expose it:
ngrok http 3000

# Copy the URL provided (e.g., https://abc123.ngrok.io)

# Update .env:
SERVER_IP=https://abc123.ngrok.io
```

### Solution 5: Check Google Sign-In Configuration

Verify your Google OAuth credentials in `signUp.jsx`:

```javascript
GoogleSignin.configure({
  scopes: [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
  ],
  ClientId: '842164284838-nuqnp2moeos51tki7r5l8ee3tnvn3inc.apps.googleusercontent.com',
  // Add webClientId if needed:
  // webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
});
```

### Solution 6: Emulator Internet Test

Create a test to verify emulator internet access:

```bash
# Start emulator with explicit DNS:
emulator -avd Nexus_5_API_33 -dns-server 8.8.8.8

# Once running, check internet:
adb shell curl https://www.google.com
```

---

## Quick Checklist

- [ ] Backend server is running (`npm start` or `npm run dev`)
- [ ] SERVER_IP in .env is your actual machine IP (not localhost)
- [ ] Emulator has internet connectivity
- [ ] Firewall is not blocking port 3000
- [ ] Google OAuth Client ID is correctly configured
- [ ] No typos in API endpoints

---

## Common IPs to Try

If using Windows with Hyper-V or VirtualBox, try these common IPs:
- `192.168.x.x` - Local network
- `10.0.x.x` - Some network setups
- `172.17.x.x` - Docker/VirtualBox bridge

**To find your actual IP:**
```powershell
# Windows PowerShell
ipconfig | findstr /i "IPv4"

# Then use that IP in .env
SERVER_IP=http://<found-ip>:3000
```

---

## If Issue Persists

1. **Check console logs** for exact error messages
2. **Enable Android Debug Bridge (adb) logging**:
   ```bash
   adb logcat | grep "Network\|fetch\|ERROR"
   ```
3. **Test with Postman** - Call the endpoint directly to verify backend works
4. **Try different DNS servers**: 1.1.1.1, 8.8.8.8, 8.8.4.4
