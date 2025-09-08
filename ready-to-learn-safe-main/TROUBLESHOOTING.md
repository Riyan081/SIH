# SafeEd Connection Troubleshooting Guide

## Issue: "Failed to fetch" when creating institution account

### Root Cause Analysis

The "failed to fetch" error when creating an institution account is caused by a **CORS (Cross-Origin Resource Sharing) mismatch** between the frontend and backend.

**Current Configuration:**
- **Frontend**: Running on `http://localhost:8080` (configured in `vite.config.ts`)
- **Backend CORS**: Originally configured for `http://localhost:5173` in `.env`
- **API Endpoint**: Correctly configured to `http://localhost:5000/api`

### ✅ Solution Applied

I've updated the backend configuration to support both common frontend ports:

**File: `backend/.env`**
```env
FRONTEND_URL=http://localhost:8080,http://localhost:5173
```

**File: `backend/config/config.js`**
```javascript
cors: {
  origin: process.env.FRONTEND_URL ? 
    process.env.FRONTEND_URL.split(',').map(url => url.trim()) : 
    ['http://localhost:5173', 'http://localhost:8080'],
  credentials: true
}
```

### 🔧 To Apply The Fix

1. **Restart the Backend Server** (IMPORTANT):
   ```powershell
   # If running manually, press Ctrl+C to stop the backend server, then:
   cd "E:\ready-to-learn-safe-main\ready-to-learn-safe-main\backend"
   npm run dev
   ```

2. **Or use the startup script**:
   ```powershell
   cd "E:\ready-to-learn-safe-main\ready-to-learn-safe-main"
   .\start-dev.ps1
   ```

### 🧪 Testing the Fix

After restarting the backend, test the API connection:

**PowerShell Test Command:**
```powershell
$body = @{
  name = "Test University"
  institutionId = "TEST_UNIV_02"
  email = "admin@testuniv2.edu"
  password = "TestPass123@"
  confirmPassword = "TestPass123@"
  phone = "9876543210"
  location = @{
    state = "Maharashtra"
    district = "Mumbai"
    city = "Mumbai"
    pincode = "400001"
    address = "123 University Road, Andheri, Mumbai"
  }
} | ConvertTo-Json -Depth 3; 

Invoke-WebRequest -Uri "http://localhost:5000/api/auth/institution/register" -Method POST -ContentType "application/json" -Body $body
```

**Expected Response:**
- Status Code: `201`
- JSON response with `success: true`

### 🔍 Additional Verification Steps

1. **Check Backend Health:**
   ```powershell
   Invoke-WebRequest -Uri "http://localhost:5000/health" -Method GET
   ```

2. **Check Frontend Port:**
   - Open browser to `http://localhost:8080`
   - Verify the SafeEd application loads

3. **Check Browser Console:**
   - Open Developer Tools (F12)
   - Look for CORS errors in Console tab
   - Should see successful API calls after fix

### 🚨 Common Issues & Solutions

#### Issue 1: Backend Server Not Restarted
**Symptoms:** Still getting "failed to fetch" error
**Solution:** Restart the backend server to pick up new CORS settings

#### Issue 2: Wrong Frontend Port
**Symptoms:** Frontend accessible on different port
**Solution:** Check `vite.config.ts` for actual port configuration

#### Issue 3: Firewall/Antivirus Blocking
**Symptoms:** Connection timeout
**Solution:** Temporarily disable firewall/antivirus or add exceptions

#### Issue 4: MongoDB Connection Issue
**Symptoms:** Backend starts but API calls fail with 500 errors
**Solution:** Check MongoDB Atlas connection string in `backend/.env`

### 📋 Configuration Summary

**Backend Configuration:**
- Port: `5000`
- CORS Origins: `http://localhost:8080`, `http://localhost:5173`
- Database: MongoDB Atlas (configured)
- API Base: `http://localhost:5000/api`

**Frontend Configuration:**
- Port: `8080` (Vite config)
- API Base URL: `http://localhost:5000/api` (AuthContext)
- Build Tool: Vite with React

### 🔗 API Endpoints Available

After fix, these endpoints should work from the frontend:

**Institution Endpoints:**
- `POST /api/auth/institution/register` - Register institution
- `POST /api/auth/institution/login` - Institution login

**Student Endpoints:**
- `POST /api/auth/student/register` - Register student
- `POST /api/auth/student/login` - Student login

**Utility Endpoints:**
- `GET /health` - Server health check
- `GET /api` - API information

### 📝 Next Steps After Fix

1. ✅ **Test Institution Registration** - Should work now
2. ✅ **Test Student Registration** - Should also work
3. ✅ **Test Login Functionality** - Both user types
4. ✅ **Test Profile Updates** - Authenticated endpoints
5. ⏳ **Add More Features** - Once auth is stable

### 🆘 If Issues Persist

If you're still experiencing connection issues after applying the fix:

1. **Check Process List:**
   ```powershell
   Get-Process -Name "node" | Select-Object Id, ProcessName, Path
   ```

2. **Kill All Node Processes:**
   ```powershell
   Get-Process -Name "node" | Stop-Process -Force
   ```

3. **Clean Restart:**
   ```powershell
   cd "E:\ready-to-learn-safe-main\ready-to-learn-safe-main\backend"
   npm run dev
   ```

4. **Check Network Connectivity:**
   ```powershell
   Test-NetConnection -ComputerName localhost -Port 5000
   Test-NetConnection -ComputerName localhost -Port 8080
   ```

---

**Expected Result:** Institution registration should work successfully from the frontend after these changes! 🎉
