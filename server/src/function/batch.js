let logQueue = [];
const BATCH_SIZE = 10;

const saveLog = async (userId, username, action, details, req) => {
  try {
    const logEntry = {
      userId,
      username,
      action,
      details,
      ip: req?.ip || req?.connection?.remoteAddress || 'unknown',
      timestamp: new Date()
    };
    
    logQueue.push(logEntry);
    
    if (logQueue.length >= BATCH_SIZE) {
      await processBatch();
    }
  } catch (error) {
    console.log('Log queue failed:', error.message);
  }
};

const processBatch = async () => {
  if (logQueue.length === 0) return;
  
  const batch = logQueue.splice(0, BATCH_SIZE);
  try {
    await ActivityLog.insertMany(batch);
  } catch (error) {
    console.log('Batch log save failed:', error.message);
  }
};

module.exports = { processBatch, saveLog }; // Exporting both functions for use in routes and server shutdown