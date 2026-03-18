const mongoose = require("mongoose");

const ActivityLogSchema = new mongoose.Schema({
  userId: Number,      
  username: String,    
  action: String,      
  details: String,     
  ip: String,          
  timestamp: { type: Date, default: Date.now } 
});

module.exports = mongoose.model("ActivityLog", ActivityLogSchema);