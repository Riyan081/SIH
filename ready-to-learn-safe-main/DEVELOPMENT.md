# SafeEd Development Guide

## Overview
SafeEd is a disaster preparedness education system with a React frontend and Node.js/Express backend with MongoDB.

## Quick Start

### Prerequisites
- **Node.js** (v16 or higher) - Download from [nodejs.org](https://nodejs.org/)
- **MongoDB** - Either locally installed or MongoDB Atlas connection
- **Git** (recommended)

### 🚀 Option 1: Automated Startup Script (Recommended)

1. Open PowerShell as Administrator and navigate to the project folder:
   ```powershell
   cd "E:\ready-to-learn-safe-main\ready-to-learn-safe-main"
   ```

2. Set execution policy (if needed):
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

3. Run the startup script:
   ```powershell
   .\start-dev.ps1
   ```

This will automatically:
- Open two new PowerShell windows
- Start the backend server on http://localhost:5000
- Start the frontend server on http://localhost:5173

### 🔧 Option 2: Manual Setup

#### Terminal 1 - Backend Server
```powershell
cd "E:\ready-to-learn-safe-main\ready-to-learn-safe-main\backend"
npm install
npm run dev
```

#### Terminal 2 - Frontend Server  
```powershell
cd "E:\ready-to-learn-safe-main\ready-to-learn-safe-main"
npm install
npm run dev
```

## Configuration

### Backend Environment Variables
Create a `.env` file in the `backend` folder with:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/safeed
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/safeed

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## API Endpoints

### Authentication Endpoints

#### Students
- `POST /api/auth/student/register` - Student registration
- `POST /api/auth/student/login` - Student login
- `GET /api/auth/student/profile` - Get student profile
- `PUT /api/auth/student/profile` - Update student profile
- `POST /api/auth/student/change-password` - Change password
- `POST /api/auth/student/logout` - Logout

#### Institutions
- `POST /api/auth/institution/register` - Institution registration
- `POST /api/auth/institution/login` - Institution login
- `GET /api/auth/institution/profile` - Get institution profile
- `PUT /api/auth/institution/profile` - Update institution profile
- `POST /api/auth/institution/change-password` - Change password
- `POST /api/auth/institution/logout` - Logout

### Utility Endpoints
- `GET /health` - Health check
- `GET /api` - API information
- `POST /api/auth/verify-token` - Verify JWT token

## Project Structure

```
├── backend/
│   ├── config/
│   │   ├── database.js      # MongoDB connection
│   │   └── environment.js   # Environment variables
│   ├── controllers/
│   │   └── authController.js # Authentication logic
│   ├── middleware/
│   │   ├── auth.js          # JWT authentication
│   │   ├── errorHandler.js  # Error handling
│   │   └── validation.js    # Request validation
│   ├── models/
│   │   ├── Student.js       # Student schema
│   │   └── Institution.js   # Institution schema
│   ├── routes/
│   │   ├── auth.js          # Auth routes
│   │   └── index.js         # Route index
│   ├── utils/
│   │   ├── jwt.js           # JWT utilities
│   │   └── response.js      # Response utilities
│   ├── .env                 # Environment variables
│   └── package.json
├── src/                     # React frontend source
├── public/                  # Static assets
├── start-dev.ps1           # Development startup script
├── start-safeed.ps1        # Advanced startup script
└── package.json            # Frontend dependencies
```

## Development Workflow

1. **Start Development Servers**: Use `.\start-dev.ps1` or manual terminal setup
2. **Backend Development**: API changes in `backend/` folder
3. **Frontend Development**: React components in `src/` folder
4. **Database**: Use MongoDB Compass or CLI to inspect data
5. **Testing**: Test API endpoints with Postman or similar tools

## Troubleshooting

### Common Issues

**PowerShell Execution Policy Error:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**Port Already in Use:**
- Change ports in backend `.env` file and frontend `vite.config.js`
- Or stop existing processes

**MongoDB Connection Error:**
- Ensure MongoDB is running locally or check Atlas connection string
- Verify database credentials and network access

**Node Modules Issues:**
```powershell
# Clean install
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

### Logs and Debugging

- **Backend logs**: Check the backend terminal for API request logs
- **Frontend logs**: Check browser console (F12) for frontend errors
- **MongoDB logs**: Check MongoDB server logs for database issues

## Next Steps

1. **Frontend Authentication Pages**: Create login/register components
2. **API Integration**: Connect React components to backend endpoints  
3. **Testing**: Implement unit and integration tests
4. **Deployment**: Prepare for production deployment

## Support

For issues or questions about the development setup, check:
1. Terminal output for error messages
2. Browser console for frontend errors
3. MongoDB connection status
4. Environment variable configuration
