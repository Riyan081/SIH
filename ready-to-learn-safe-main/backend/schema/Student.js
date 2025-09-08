const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

/**
 * Student Schema
 * Represents students belonging to educational institutions
 */
const StudentSchema = new mongoose.Schema({
  institutionId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: [true, "Institution ID is required"], // Required again
    ref: "Institution"
  },
  
  name: { 
    type: String, 
    required: [true, "Student name is required"],
    trim: true,
    minlength: [2, "Name must be at least 2 characters"],
    maxlength: [50, "Name cannot exceed 50 characters"]
  },
  
  rollNo: { 
    type: Number, 
    required: [true, "Roll number is required"],
    min: [1, "Roll number must be at least 1"],
    max: [999999, "Roll number cannot exceed 999999"]
  },
  
  division: { 
    type: String, 
    required: [true, "Division is required"],
    trim: true,
    maxlength: [10, "Division cannot exceed 10 characters"]
  },
  
  class: { 
    type: String, 
    required: [true, "Class is required"],
    trim: true,
    enum: {
      values: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
      message: 'Class must be valid (1-12 for school)'
    }
  },
  
  admissionYear: { 
    type: Number, 
    required: [true, "Admission year is required"],
    min: [2000, "Admission year must be 2000 or later"],
    max: [new Date().getFullYear() + 5, "Admission year cannot be more than 5 years in the future"],
    validate: {
      validator: function(v) {
        return Number.isInteger(v);
      },
      message: 'Admission year must be a valid year'
    }
  },
  
  phone: { 
    type: String, 
    required: [true, "Phone number is required"],
    trim: true,
    match: [/^[6-9]\d{9}$/, "Please provide a valid 10-digit Indian mobile number"]
  },
  
  parentPhone: { 
    type: String, 
    required: [true, "Parent phone number is required"],
    trim: true,
    match: [/^[6-9]\d{9}$/, "Please provide a valid 10-digit parent mobile number"]
  },
  
  email: { 
    type: String, 
    required: [true, "Email is required"],
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
    minlength: [6, "Password must be at least 6 characters long"],
    select: false // Don't include password in queries by default
  },
  
  // Learning Progress Data
  learningProgress: {
    completedModules: [{
      moduleId: {
        type: String,
        enum: ['earthquake', 'fire', 'flood', 'cyclone', 'pandemic']
      },
      completedAt: {
        type: Date,
        default: Date.now
      },
      score: {
        type: Number,
        min: 0,
        max: 100
      }
    }],
    
    totalQuizzesTaken: {
      type: Number,
      default: 0,
      min: 0
    },
    
    averageQuizScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    
    badgesEarned: [{
      badgeId: String,
      earnedAt: {
        type: Date,
        default: Date.now
      }
    }],
    
    currentStreak: {
      type: Number,
      default: 0,
      min: 0
    },
    
    longestStreak: {
      type: Number,
      default: 0,
      min: 0
    },
    
    lastActivityDate: {
      type: Date,
      default: Date.now
    },
    
    totalStudyTime: {
      type: Number, // in minutes
      default: 0,
      min: 0
    }
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
  
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Profile completion
  profileCompleted: {
    type: Boolean,
    default: false
  },
  
  // Email verification
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  
  emailVerificationToken: {
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

// Compound unique index: email must be unique within each institution
StudentSchema.index({ institutionId: 1, email: 1 }, { unique: true });

// Compound unique index: rollNo must be unique within each institution
StudentSchema.index({ institutionId: 1, rollNo: 1 }, { unique: true });

// Other useful indexes
StudentSchema.index({ isActive: 1 });
StudentSchema.index({ division: 1, class: 1 });
StudentSchema.index({ admissionYear: 1 });
StudentSchema.index({ 'learningProgress.lastActivityDate': -1 });

// Virtual for account lock status
StudentSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Virtual for overall completion percentage
StudentSchema.virtual('completionPercentage').get(function() {
  const totalModules = 5; // earthquake, fire, flood, cyclone, pandemic
  const completedCount = this.learningProgress.completedModules.length;
  return Math.round((completedCount / totalModules) * 100);
});

// Virtual for level calculation
StudentSchema.virtual('level').get(function() {
  const totalScore = this.learningProgress.completedModules.reduce((sum, module) => {
    return sum + (module.score || 0);
  }, 0);
  return Math.floor(totalScore / 100) + 1; // Basic level calculation
});

// Pre-save middleware to hash password
StudentSchema.pre('save', async function(next) {
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

// Pre-save middleware to update profile completion status
StudentSchema.pre('save', function(next) {
  // Check if all required fields are filled
  const requiredFields = ['name', 'rollNo', 'division', 'class', 'admissionYear', 'phone', 'parentPhone', 'email'];
  this.profileCompleted = requiredFields.every(field => {
    return this[field] && this[field].toString().trim().length > 0;
  });
  next();
});

// Instance method to check password
StudentSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// Instance method to increment login attempts
StudentSchema.methods.incLoginAttempts = function() {
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
StudentSchema.methods.resetLoginAttempts = function() {
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

// Instance method to update learning progress
StudentSchema.methods.updateLearningProgress = function(updateData) {
  if (updateData.moduleCompleted) {
    this.learningProgress.completedModules.push({
      moduleId: updateData.moduleCompleted.moduleId,
      score: updateData.moduleCompleted.score,
      completedAt: new Date()
    });
  }
  
  if (updateData.quizScore !== undefined) {
    this.learningProgress.totalQuizzesTaken += 1;
    const currentTotal = this.learningProgress.averageQuizScore * (this.learningProgress.totalQuizzesTaken - 1);
    this.learningProgress.averageQuizScore = Math.round((currentTotal + updateData.quizScore) / this.learningProgress.totalQuizzesTaken);
  }
  
  if (updateData.badgeEarned) {
    this.learningProgress.badgesEarned.push({
      badgeId: updateData.badgeEarned,
      earnedAt: new Date()
    });
  }
  
  this.learningProgress.lastActivityDate = new Date();
  
  return this.save();
};

// Instance method to generate auth token
StudentSchema.methods.generateAuthToken = function() {
  return {
    id: this._id,
    email: this.email,
    rollNo: this.rollNo,
    name: this.name,
    institutionId: this.institutionId,
    type: 'student'
  };
};

// Static method to find by credentials
StudentSchema.statics.findByCredentials = async function(email, password, institutionId = null) {
  const query = { 
    email: email.toLowerCase(),
    isActive: true 
  };
  
  if (institutionId) {
    query.institutionId = institutionId;
  }
  
  const student = await this.findOne(query).select('+password').populate('institutionId', 'name institutionId');
  
  if (!student) {
    throw new Error('Invalid login credentials');
  }
  
  if (student.isLocked) {
    throw new Error('Account temporarily locked due to too many failed login attempts');
  }
  
  const isMatch = await student.comparePassword(password);
  
  if (!isMatch) {
    await student.incLoginAttempts();
    throw new Error('Invalid login credentials');
  }
  
  // Reset login attempts on successful login
  if (student.loginAttempts > 0) {
    await student.resetLoginAttempts();
  }
  
  return student;
};

// Static method to find students by institution (optional now)
StudentSchema.statics.findByInstitution = function(institutionId, options = {}) {
  const query = { isActive: true };
  
  if (institutionId) query.institutionId = institutionId;
  if (options.division) query.division = options.division;
  if (options.admissionYear) query.admissionYear = options.admissionYear;
  if (options.class) query.class = options.class;
  
  return this.find(query)
    .select('-password')
    .populate('institutionId', 'name institutionId')
    .sort(options.sort || { 'learningProgress.lastActivityDate': -1 });
};

module.exports = mongoose.model("Student", StudentSchema);
