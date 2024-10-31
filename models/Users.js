const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true }, // All
  fatherName: { type: String, trim: true }, // All
  email: {
    type: String,
    required: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Invalid email address'],
    unique: true,
    trim: true
  }, // All             
  password: { type: String, select: false }, // User
  code: { type: String, trim: true }, // User
  userTypeId: { type: Number, required: true }, // All
  cnic: {
    type: String,
    match: [/^\d{13}$/, 'Invalid CNIC number'],
    default: null,
    trim: true
  },
  mobileNo: {
    type: String,
    match: [/^\d{11}$/, 'Invalid mobile number'],
    trim: true
  }, // All
  addresses: {
    current: { type: String, default: null, trim: true },
    permanent: { type: String, default: null, trim: true }
  }, // All
  dob: { type: Date, default: null }, // All
  personalDetails: {
    gender: { type: String, default: null, trim: true },
    maritalStatus: { type: String, default: null, trim: true },
    religion: { type: String, default: null, trim: true },
    bloodGroup: { type: String, default: null, trim: true }
  }, // All
  emergencyContact: {
    number: {
      type: String,
      match: [/^\d{11}$/, 'Invalid mobile number'],
      trim: true
    },
    name: { type: String, default: null, trim: true },
    relation: { type: String, default: null, trim: true }
  },
  isActive: { type: Boolean, required: true, default: true }, // All
  professionalDetails: {
    linkedIn: { type: String, trim: true },
    gitHub: { type: String, trim: true },
    cv: { type: String, trim: true, default: null },
    otherDocs: { type: String, trim: true, default: null },
    expYears: { type: Number },
    prevJobs: [{
      organization: { type: String, trim: true },
      designation: { type: String, trim: true },
      startDate: { type: Date },
      endDate: { type: Date },
      reasonForLeaving: { type: String, trim: true }
    }], // All
    education: [{
      degree: { type: String, trim: true },
      institute: { type: String, trim: true },
      passingYear: { type: Date },
      grade: { type: String, trim: true }
    }], // All
    relatives: [{
      name: { type: String, trim: true },
      designation: { type: String, trim: true },
      relation: { type: String, trim: true },
      contact: {
        type: String,
        match: [/^\d{11}$/, 'Invalid mobile number'],
        trim: true
      }
    }], // User
    priorExp: {
      designation: { type: String, trim: true },
      employeeId: { type: String, trim: true },
      tenureOfService: { type: Number },
      reasonForLeaving: { type: String, trim: true }
    }, // All
    bankDetails: [{
      bankName: { type: String, trim: true },
      branchName: { type: String, trim: true },
      accTitle: { type: String, trim: true },
      accNo: { type: Number, trim: true },
      iban: { type: String, trim: true },

    }], // Users
    expSalary: { type: Number }, // Visitor
    expJoining: { type: Date }, // Visitor
    onSite: { type: Boolean }, // Visitor
    position: { type: String, trim: true }, // All
    skills: [{ type: String, trim: true }], // All
    portfolio: [{ type: String, trim: true }], // All
    refs: [{ type: String, trim: true }], // Visitor
    questions: { type: String, trim: true } // Visitor
  }
}, {
  timestamps: true,
  versionKey: false
});
// Pre-save hook to hash password and store old password
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    const oldPassword = this.password; // Store current password before hashing
    this.password = await bcrypt.hash(this.password, 12); // Hash the new password
    this.oldPassword = oldPassword; // Store the old password
  }
  next();
});

module.exports = mongoose.model('User', userSchema);