const mongoose = require("mongoose");
const validate = require("validator");

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    institutionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Institution", // References the Institution model
      required: true,
    },
    email: {
      type: String,
      lowercase: true,
      required: true,
      validate(value) {
        if (!validate.isEmail(value)) {
          throw new Error("Invalid Email");
        }
      },
    },
    password: { // The password field is still here, but without a pre-save hook
      type: String,
      required: true,
      validate(value) {
        if (!validate.isStrongPassword(value)) {
          throw new Error("Password is not strong enough");
        }
      },
    },
    rollNo: {
      type: String,
      required: true,
    },
    division: {
      type: String,
      required: true,
    },
    year: {
      type: String,
      default: new Date().getFullYear().toString(),
    },
    class: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      validate(value) {
        if (value && !validate.isMobilePhone(value, "en-IN")) {
          throw new Error("Invalid Phone Number");
        }
      },
    },
    parentPhone: {
      type: String,
      validate(value) {
        if (value && !validate.isMobilePhone(value, "en-IN")) {
          throw new Error("Invalid Phone Number");
        }
      },
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for multi-institution support
studentSchema.index({ institutionId: 1, email: 1 }, { unique: true });
studentSchema.index({ institutionId: 1, rollNo: 1 }, { unique: true });

const Student = mongoose.model("Student", studentSchema);
module.exports = Student;