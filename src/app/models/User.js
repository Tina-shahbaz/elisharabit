import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // 👤 Basic Info
    firstName: { type: String, required: true, trim: true, maxlength: 50 },
    lastName: { type: String, required: true, trim: true, maxlength: 50 },
    username: { type: String, required: true, unique: true, trim: true, lowercase: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    countryCode: { type: String, required: true },
    phone: { type: String, required: true, trim: true },

    // 💡 Role
    role: { type: String, enum: ["customer", "tasker", "admin"], default: "tasker" },

    password: { type: String, required: true, minlength: 8 },
    zipCode: { type: String, trim: true },

    // ✅ Verification
    isVerified: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: false },
    otp: { type: String },
    otpExpiresAt: { type: Date },

    // 🧰 Tasker Details - UPDATED
    city: { 
      type: String,
      trim: true
    },
    fullAddress: { type: String, trim: true, default: "" },
    skills: { 
      type: [{ type: String, trim: true }], 
      default: []
    },
    availability: { type: Boolean, default: true },
    bio: { 
      type: String, 
      trim: true,
      maxlength: 1000,
      default: ""
    },

    // 📅 Availability Timing - NEW (چونکہ frontend میں یہ موجود ہے)
    availabilityTiming: {
      startWork: { 
        type: String, 
        enum: ["today", "tomorrow", "in_one_week"], 
        default: "today" 
      },
      preferredTime: { 
        type: [String], 
        enum: ["morning", "afternoon", "evening"], 
        default: ["morning", "afternoon", "evening"] 
      },
      availableDays: { 
        type: [String], 
        enum: ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"], 
        default: ["monday","tuesday","wednesday","thursday","friday"]
      }
    },

    // ⏰ Working Hours - NEW (چونکہ frontend میں یہ موجود ہے)
    workingHours: {
      hoursPerDay: { 
        type: Number, 
        min: 1, 
        max: 24, 
        default: 8
      },
      daysPerWeek: { 
        type: Number, 
        min: 1, 
        max: 7, 
        default: 5
      },
      totalHoursPerWeek: { 
        type: Number, 
        min: 1, 
        max: 168, 
        default: 40
      }
    },

    hourlyRate: { type: Number, default: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewsCount: { type: Number, default: 0 },

    profileImage: { type: String },

    twoFA: { type: Boolean, default: false },
    twoFASecret: { type: String },

    identityVerification: {
      idType: { type: String, enum: ["CNIC", "Passport", "DriverLicense", "Other"], default: "CNIC" },
      idNumber: { type: String, trim: true },
      idImageFront: { type: String },
      idImageBack: { type: String },
      status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
      verifiedAt: { type: Date },
    },

    approvedAt: { type: Date },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

// Indexes
userSchema.index({ role: 1, isApproved: 1, availability: 1 });
userSchema.index({ "availabilityTiming.preferredTime": 1 }); // NEW
userSchema.index({ "availabilityTiming.availableDays": 1 }); // NEW
userSchema.index({ "workingHours.totalHoursPerWeek": 1 }); // NEW
userSchema.index({ city: 1 });
userSchema.index({ skills: 1 });

// Virtual
userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;