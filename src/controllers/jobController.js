const fs = require('fs');
const path = require('path');

class JobModel {
    constructor() {
        this.jobsFilePath = path.join(__dirname, '../data/jobs.json');
        this.ensureFileExists();
    }

    ensureFileExists() {
        if (!fs.existsSync(this.jobsFilePath)) {
            fs.writeFileSync(this.jobsFilePath, JSON.stringify([]));
        }
    }

    getJobs() {
        const data = fs.readFileSync(this.jobsFilePath);
        return JSON.parse(data);
    }

    saveJobs(jobs) {
        fs.writeFileSync(this.jobsFilePath, JSON.stringify(jobs, null, 2));
    }

    find() {
        return this.getJobs().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    findById(id) {
        const jobs = this.getJobs();
        return jobs.find(job => job._id === id);
    }

    create(jobData) {
        const jobs = this.getJobs();
        const newJob = {
            ...jobData,
            _id: this.generateId(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        jobs.push(newJob);
        this.saveJobs(jobs);
        return newJob;
    }

    findByIdAndUpdate(id, updateData) {
        const jobs = this.getJobs();
        const jobIndex = jobs.findIndex(job => job._id === id);
        
        if (jobIndex === -1) return null;

        jobs[jobIndex] = {
            ...jobs[jobIndex],
            ...updateData,
            updatedAt: new Date().toISOString()
        };

        this.saveJobs(jobs);
        return jobs[jobIndex];
    }

    findByIdAndDelete(id) {
        const jobs = this.getJobs();
        const filteredJobs = jobs.filter(job => job._id !== id);
        this.saveJobs(filteredJobs);
    }

    generateId() {
        return Math.random().toString(36).substr(2, 9);
    }
}

module.exports = new JobModel();