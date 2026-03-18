const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema({
  threadId: Number,        
  threadTitle: String,     
  reporterId: Number,      
  reporterEmail: String,   
  reason: String,          
  createdAt: { type: Date, default: Date.now } 
});

module.exports = mongoose.model("Report", ReportSchema);