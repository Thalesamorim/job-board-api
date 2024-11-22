const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    title: String,
    description: String,
    company: String,
    isOpen: Boolean,
    contactNumber: String,
}, {
    timestamps: true
});

module.exports = mongoose.model('Job', JobSchema);