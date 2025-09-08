const Student = require('../schema/Student');
const Institution = require('../schema/Institution');
const { generateToken } = require('../utils/jwt');
const { sendSuccess, sendError, sendCreated, asyncHandler } = require('../utils/response');

/**
 * Authentication Controllers
 */

/**
 * Register a new student
 * @route POST /api/auth/student/register
 */
const registerStudent = asyncHandler(async (req, res) => {
  const {
    institutionId, // required now
    name,
    rollNo,
    division,
    class: studentClass,
    admissionYear,
    phone,
    parentPhone,
    email,
    password
  } = req.body;

  try {
    // Check if institution exists and is active (required)
    const institution = await Institution.findOne({ institutionId: institutionId.toUpperCase() });
    if (!institution || !institution.isActive) {
      return sendError(res, 400, 'Invalid or inactive institution ID');
    }

    // Check if student with same email already exists in this institution
    const existingEmailStudent = await Student.findOne({
      institutionId: institution._id, // Use the MongoDB _id for reference
      email: email.toLowerCase()
    });

    if (existingEmailStudent) {
      return sendError(res, 409, 'A student with this email already exists in this institution');
    }

    // Check if student with same roll number already exists in this institution
    const existingRollNoStudent = await Student.findOne({
      institutionId: institution._id, // Use the MongoDB _id for reference
      rollNo: Number(rollNo)
    });

    if (existingRollNoStudent) {
      return sendError(res, 409, 'A student with this roll number already exists in this institution');
    }

    // Create new student (store the institution's MongoDB _id as reference)
    const student = new Student({
      institutionId: institution._id, // Store the MongoDB _id, not the institutionId string
      name,
      rollNo: Number(rollNo),
      division,
      class: studentClass,
      admissionYear: Number(admissionYear),
      phone,
      parentPhone,
      email: email.toLowerCase(),
      password
    });

    await student.save();

    // Generate JWT token
    const tokenPayload = student.generateAuthToken();
    const token = generateToken(tokenPayload);

    // Remove password from response
    const studentResponse = student.toObject();
    delete studentResponse.password;

    sendCreated(res, 'Student registered successfully', {
      user: studentResponse,
      token
    });

  } catch (error) {
    console.error('Student registration error:', error);
    
    // Handle MongoDB duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      const message = field === 'email' ? 
        'Email already exists in this institution' : 
        'Roll number already exists in this institution';
      return sendError(res, 409, message);
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return sendError(res, 400, 'Validation failed', { details: messages });
    }
    
    sendError(res, 500, 'Registration failed. Please try again.');
  }
});

/**
 * Register a new institution
 * @route POST /api/auth/institution/register
 */
const registerInstitution = asyncHandler(async (req, res) => {
  const {
    name,
    institutionId,
    email,
    password,
    phone,
    location
  } = req.body;

  try {
    // Check if institution with same email already exists
    const existingEmailInstitution = await Institution.findOne({
      email: email.toLowerCase()
    });

    if (existingEmailInstitution) {
      return sendError(res, 409, 'Institution with this email already exists');
    }

    // Check if institution with same institution ID already exists
    const existingIdInstitution = await Institution.findOne({
      institutionId: institutionId.toUpperCase()
    });

    if (existingIdInstitution) {
      return sendError(res, 409, 'Institution ID already exists');
    }

    // Create new institution
    const institution = new Institution({
      name,
      institutionId: institutionId.toUpperCase(),
      email: email.toLowerCase(),
      password,
      phone,
      location
    });

    await institution.save();

    // Generate JWT token
    const tokenPayload = institution.generateAuthToken();
    const token = generateToken(tokenPayload);

    // Remove password from response
    const institutionResponse = institution.toObject();
    delete institutionResponse.password;

    sendCreated(res, 'Institution registered successfully', {
      user: institutionResponse,
      token
    });

  } catch (error) {
    console.error('Institution registration error:', error);
    
    // Handle MongoDB duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      const message = field === 'email' ? 
        'Email already exists' : 
        'Institution ID already exists';
      return sendError(res, 409, message);
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return sendError(res, 400, 'Validation failed', { details: messages });
    }
    
    sendError(res, 500, 'Registration failed. Please try again.');
  }
});

/**
 * Login student
 * @route POST /api/auth/student/login
 */
const loginStudent = asyncHandler(async (req, res) => {
  const { email, password } = req.body; // institutionId no longer required

  try {
    // Find student by credentials (no institutionId required)
    const student = await Student.findByCredentials(
      email.toLowerCase(), 
      password
    );

    // Generate JWT token
    const tokenPayload = student.generateAuthToken();
    const token = generateToken(tokenPayload);

    // Remove password from response
    const studentResponse = student.toObject();
    delete studentResponse.password;

    sendSuccess(res, 200, 'Login successful', {
      user: studentResponse,
      token
    });

  } catch (error) {
    console.error('Student login error:', error);
    
    if (error.message.includes('locked') || error.message.includes('Invalid login')) {
      return sendError(res, 401, error.message);
    }
    
    sendError(res, 500, 'Login failed. Please try again.');
  }
});

/**
 * Login institution
 * @route POST /api/auth/institution/login
 */
const loginInstitution = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find institution by credentials
    const institution = await Institution.findByCredentials(
      email.toLowerCase(), 
      password
    );

    // Generate JWT token
    const tokenPayload = institution.generateAuthToken();
    const token = generateToken(tokenPayload);

    // Remove password from response
    const institutionResponse = institution.toObject();
    delete institutionResponse.password;

    sendSuccess(res, 200, 'Login successful', {
      user: institutionResponse,
      token
    });

  } catch (error) {
    console.error('Institution login error:', error);
    
    if (error.message.includes('locked') || error.message.includes('Invalid login')) {
      return sendError(res, 401, error.message);
    }
    
    sendError(res, 500, 'Login failed. Please try again.');
  }
});

/**
 * Logout user (client-side token removal)
 * @route POST /api/auth/logout
 */
const logout = asyncHandler(async (req, res) => {
  // In a JWT-based system, logout is typically handled client-side
  // by removing the token from storage. We can add token blacklisting
  // in future if needed.
  
  sendSuccess(res, 200, 'Logged out successfully', {
    message: 'Please remove the token from client storage'
  });
});

/**
 * Verify current user token and return user info
 * @route GET /api/auth/me
 */
const getMe = asyncHandler(async (req, res) => {
  // User is already attached to req by auth middleware
  const user = req.user.toObject();
  delete user.password;

  sendSuccess(res, 200, 'User information retrieved successfully', {
    user,
    userType: req.userType
  });
});

/**
 * Refresh user token (future implementation)
 * @route POST /api/auth/refresh
 */
const refreshToken = asyncHandler(async (req, res) => {
  // This would be implemented when we add refresh token functionality
  sendError(res, 501, 'Refresh token functionality not implemented yet');
});

/**
 * Change password for authenticated user
 * @route PUT /api/auth/change-password
 */
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = req.user;
    
    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return sendError(res, 400, 'Current password is incorrect');
    }

    // Update password
    user.password = newPassword;
    await user.save();

    sendSuccess(res, 200, 'Password changed successfully');

  } catch (error) {
    console.error('Change password error:', error);
    sendError(res, 500, 'Failed to change password. Please try again.');
  }
});

/**
 * Get user profile
 * @route GET /api/auth/profile
 */
const getProfile = asyncHandler(async (req, res) => {
  const user = req.user.toObject();
  delete user.password;

  sendSuccess(res, 200, 'Profile retrieved successfully', {
    user,
    userType: req.userType
  });
});

/**
 * Update user profile
 * @route PUT /api/auth/profile
 */
const updateProfile = asyncHandler(async (req, res) => {
  const updates = req.body;
  const user = req.user;

  try {
    // Only allow updating certain fields
    const allowedUpdates = req.userType === 'student' 
      ? ['name', 'phone', 'parentPhone']
      : ['name', 'phone'];

    const updateFields = {};
    
    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updateFields[key] = updates[key];
      }
    });

    if (Object.keys(updateFields).length === 0) {
      return sendError(res, 400, 'No valid fields to update');
    }

    Object.assign(user, updateFields);
    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;

    sendSuccess(res, 200, 'Profile updated successfully', {
      user: userResponse
    });

  } catch (error) {
    console.error('Profile update error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return sendError(res, 400, 'Validation failed', { details: messages });
    }
    
    sendError(res, 500, 'Failed to update profile. Please try again.');
  }
});

module.exports = {
  registerStudent,
  registerInstitution,
  loginStudent,
  loginInstitution,
  logout,
  getMe,
  refreshToken,
  changePassword,
  getProfile,
  updateProfile
};
