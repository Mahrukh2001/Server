const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    fatherName: { type: String },
    email: { type: String, required: true, lowercase: true, match: /.+\@.+\..+/ },
    mobileNo: { type: String, required: true, match: /^\d{11}$/ },
    dob: { type: Date },
    linkedIn: { type: String },
    gitHub: { type: String },
    cv: { type: String },
    lastDegree: { type: String },
    yearsOfExperience: { type: Number },
    previousJobs: { type: String },
    expectedSalary: { type: Number },
    availableToStartOn: { type: Date },
    onSiteAwareness: { type: Boolean },
    positionAppliedFor: { type: String },
    skillsAndTechnologies: [{ type: String }],
    portfolioLinks: [{ type: String }],
    references: [{ type: String }],
    questionsForUs: { type: String }
}, { timestamps: true });

visitorSchema.pre('save', function (next) {
    Object.keys(this.toObject()).forEach((key) => {
        if (typeof this[key] === 'string') {
            this[key] = this[key].trim();
        } else if (Array.isArray(this[key])) {
            this[key] = this[key].map(item => typeof item === 'string' ? item.trim() : item);
        }
    });
    next();
});

const Visitor = mongoose.model('Visitor', visitorSchema);
module.exports = Visitor;
