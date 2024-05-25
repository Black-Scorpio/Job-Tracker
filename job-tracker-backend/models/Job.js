const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  jobTitle: { type: String, required: true },
  applicationDate: { type: Date, required: true },
  status: { type: String, required: true },
  jobDescription: { type: String },
  notes: { type: String },
});

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
