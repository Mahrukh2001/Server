const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, unique: true, trim: true },
  code: { type: String, default: null },
  salary: { type: Number },
  designation: { type: String, trim: true },
  joiningDate: { type: Date },
  leavingDate: { type: Date, default: null },
  status: { type: Boolean, default: true },
  createdBy: { type: String, trim: true, default: null },
  updatedBy: { type: String, trim: true, default: null }
}, {
  timestamps: true,
  versionKey: false
});

module.exports = mongoose.model('Employee', employeeSchema);