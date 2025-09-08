# SafeEd Backend API

## 🌟 Overview

The SafeEd Backend API is a Node.js/Express application that provides authentication and data management services for the SafeEd - Disaster Preparedness Education System.

## 🛠️ Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: express-validator
- **Security**: helmet, cors, bcryptjs
- **Rate Limiting**: express-rate-limit
- **Logging**: morgan

## 📁 Project Structure

```
backend/
├── config/           # Configuration files
│   ├── config.js    # Main configuration
│   └── database.js  # MongoDB connection
├── controllers/      # Request handlers
│   └── authController.js
├── middleware/       # Express middleware
│   ├── auth.js      # Authentication middleware
│   ├── validation.js # Validation rules
│   └── errorHandler.js
├── routes/          # API routes
│   ├── index.js     # Main routes
│   └── auth.js      # Authentication routes
├── schema/          # MongoDB schemas
│   ├── Student.js   # Student model
│   └── Institution.js # Institution model
├── utils/           # Utility functions
│   ├── jwt.js       # JWT utilities
│   └── response.js  # Response helpers
├── .env             # Environment variables
├── .env.example     # Environment template
├── package.json     # Dependencies
└── server.js        # Main server file
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Installation

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit the `.env` file with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/safeed
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRE=7d
   FRONTEND_URL=http://localhost:5173
   ```

4. **Start the server**
   
   Development mode (with auto-restart):
   ```bash
   npm run dev
   ```
   
   Production mode:
   ```bash
   npm start
   ```

5. **Verify installation**
   
   Visit `http://localhost:5000/api` to see the API documentation.

## 🔐 Authentication System

### User Types

1. **Students**: Individual learners who register under institutions
2. **Institutions**: Educational organizations that can register students

### Authentication Flow

1. **Registration**: Users create accounts with validation
2. **Login**: Email/password authentication with JWT tokens
3. **Authorization**: Protected routes require valid JWT tokens
4. **Security**: Rate limiting, password hashing, account lockouts

## 📚 API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/student/register` | Register new student | No |
| POST | `/institution/register` | Register new institution | No |
| POST | `/student/login` | Student login | No |
| POST | `/institution/login` | Institution login | No |
| POST | `/logout` | Logout user | Yes |
| GET | `/me` | Get current user info | Yes |
| GET | `/profile` | Get user profile | Yes |
| PUT | `/profile` | Update user profile | Yes |
| PUT | `/change-password` | Change password | Yes |

### Example Requests

#### Student Registration
```json
POST /api/auth/student/register
{
  "institutionId": "64a1234567890abcdef12345",
  "name": "John Doe",
  "rollNo": "CS2021001",
  "branch": "Computer Science",
  "division": "A",
  "year": "2nd",
  "phone": "9876543210",
  "parentPhone": "9876543211",
  "email": "john.doe@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

#### Institution Registration
```json
POST /api/auth/institution/register
{
  "name": "ABC University",
  "institutionId": "ABC_UNIV_001",
  "email": "admin@abcuniversity.edu",
  "password": "SecurePass@123",
  "confirmPassword": "SecurePass@123",
  "phone": "9876543210",
  "location": {
    "state": "Maharashtra",
    "district": "Pune",
    "city": "Pune",
    "pincode": "411001",
    "address": "123 Education Street, Pune"
  }
}
```

#### Login
```json
POST /api/auth/student/login
{
  "email": "john.doe@example.com",
  "password": "password123",
  "institutionId": "64a1234567890abcdef12345" // Optional for students
}
```

## 🔒 Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: Protection against brute force attacks
- **Input Validation**: Comprehensive validation rules
- **CORS Protection**: Configurable cross-origin requests
- **Helmet Security**: Various HTTP security headers
- **Account Lockouts**: Protection against repeated failed logins

## ⚙️ Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment mode | development |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/safeed |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRE` | JWT expiration time | 7d |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:5173 |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | 900000 (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | 100 |

## 🧪 Development

### Available Scripts

```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm test           # Run tests (when implemented)
```

### Code Style

- Use ES6+ features
- Follow clean code principles
- Add comprehensive error handling
- Include JSDoc comments for functions
- Use async/await for asynchronous operations

## 🔄 Database Schema

### Student Schema
- Personal information (name, roll number, branch, etc.)
- Learning progress tracking
- Authentication credentials
- Institution relationship

### Institution Schema
- Institution details and location
- Authentication credentials
- Status and verification fields

## 🚨 Error Handling

The API uses consistent error response format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": {
    "details": ["Specific error details"]
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 📈 Monitoring

- Request logging with Morgan
- Error tracking with custom middleware
- Health check endpoint at `/health`
- Graceful shutdown handling

## 🚀 Deployment

1. **Environment Setup**
   - Set production environment variables
   - Configure MongoDB connection
   - Set secure JWT secret

2. **Security Checklist**
   - Enable HTTPS
   - Configure proper CORS origins
   - Set up proper logging
   - Monitor rate limits

3. **Database Setup**
   - Ensure MongoDB indexes are created
   - Set up database backups
   - Configure connection pooling

## 📞 Support

For issues and questions:
- Check the API documentation at `/api`
- Review error logs
- Ensure all environment variables are set
- Verify MongoDB connection

## 🔄 Version History

- **v1.0.0**: Initial release with authentication system
