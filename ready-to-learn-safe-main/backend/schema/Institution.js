const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

/**
 * Institution Schema
 * Represents educational institutions that can register students
 */
const InstitutionSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, "Institution name is required"],
    trim: true,
    minlength: [2, "Institution name must be at least 2 characters"],
    maxlength: [100, "Institution name cannot exceed 100 characters"]
  },
  
  institutionId: { 
    type: String, 
    unique: true, 
    required: [true, "Institution ID is required"],
    trim: true,
    uppercase: true,
    match: [/^[A-Z0-9_-]+$/, "Institution ID can only contain uppercase letters, numbers, hyphens and underscores"]
  },
  
  email: { 
    type: String, 
    required: [true, "Email is required"], 
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please provide a valid email address"
    ]
  },
  
  password: { 
    type: String, 
    required: [true, "Password is required"],
    minlength: [8, "Password must be at least 8 characters long"],
    select: false // Don't include password in queries by default
  },
  
  phone: { 
    type: String, 
    required: [true, "Phone number is required"],
    trim: true,
    match: [/^[6-9]\d{9}$/, "Please provide a valid 10-digit Indian mobile number"]
  },
  
  location: {
    state: { 
      type: String, 
      required: [true, "State is required"],
      trim: true,
      minlength: [2, "State name must be at least 2 characters"]
    },
    district: { 
      type: String, 
      required: [true, "District is required"],
      trim: true,
      minlength: [2, "District name must be at least 2 characters"]
    },
    city: { 
      type: String, 
      required: [true, "City is required"],
      trim: true,
      minlength: [2, "City name must be at least 2 characters"]
    },
    pincode: { 
      type: String, 
      required: [true, "Pincode is required"],
      trim: true,
      match: [/^[1-9][0-9]{5}$/, "Please provide a valid 6-digit pincode"]
    },
    address: { 
      type: String, 
      required: [true, "Address is required"],
      trim: true,
      minlength: [10, "Address must be at least 10 characters"],
      maxlength: [500, "Address cannot exceed 500 characters"]
    }
  },
  
  isActive: { 
    type: Boolean, 
    default: true 
  },
  
  // Authentication related fields
  loginAttempts: {
    type: Number,
    default: 0
  },
  
  lockUntil: {
    type: Date
  },
  
  lastLogin: {
    type: Date
  },
  
  // Profile completion and verification
  isVerified: {
    type: Boolean,
    default: false
  },
  
  verificationToken: {
    type: String,
    select: false
  },
  
  resetPasswordToken: {
    type: String,
    select: false
  },
  
  resetPasswordExpires: {
    type: Date,
    select: false
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
InstitutionSchema.index({ isActive: 1 });
InstitutionSchema.index({ 'location.state': 1, 'location.district': 1 });

// Virtual for account lock status
InstitutionSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Pre-save middleware to hash password
InstitutionSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to check password
InstitutionSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// Instance method to increment login attempts
InstitutionSchema.methods.incLoginAttempts = function() {
  const maxAttempts = 5;
  const lockTime = 30 * 60 * 1000; // 30 minutes
  
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: {
        lockUntil: 1
      },
      $set: {
        loginAttempts: 1
      }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  
  // Lock account after max attempts
  if (this.loginAttempts + 1 >= maxAttempts && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + lockTime };
  }
  
  return this.updateOne(updates);
};

// Instance method to reset login attempts
InstitutionSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: {
      loginAttempts: 1,
      lockUntil: 1
    },
    $set: {
      lastLogin: new Date()
    }
  });
};

// Instance method to generate auth token (to be implemented with JWT)
InstitutionSchema.methods.generateAuthToken = function() {
  return {
    id: this._id,
    email: this.email,
    institutionId: this.institutionId,
    name: this.name,
    type: 'institution'
  };
};

// Static method to find by credentials
InstitutionSchema.statics.findByCredentials = async function(email, password) {
  const institution = await this.findOne({ 
    email: email.toLowerCase(),
    isActive: true 
  }).select('+password');
  
  if (!institution) {
    throw new Error('Invalid login credentials');
  }
  
  if (institution.isLocked) {
    throw new Error('Account temporarily locked due to too many failed login attempts');
  }
  
  const isMatch = await institution.comparePassword(password);
  
  if (!isMatch) {
    await institution.incLoginAttempts();
    throw new Error('Invalid login credentials');
  }
  
  // Reset login attempts on successful login
  if (institution.loginAttempts > 0) {
    await institution.resetLoginAttempts();
  }
  
  return institution;
};

module.exports = mongoose.model("Institution", InstitutionSchema);
