const rateLimit = require("express-rate-limit");

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,   
  max: 100,                   
  message: {
    ok: false,
    message: "คำขอมากเกินไป กรุณาลองใหม่ในภายหลัง" 
  },
  standardHeaders: true,      
  legacyHeaders: false,       
  skip: (req) => {
    return req.path === '/api/health';
  }
});


const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,   
  max: 5,                     
  message: {
    ok: false,
    message: "พยายามเข้าสู่ระบบมากเกินไป กรุณารอสักครู่" 
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true 
});

const createLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,   
  max: 10,                    
  message: {
    ok: false,
    message: "สร้างกระทู้มากเกินไป กรุณารอก่อนสร้างใหม่" // ข้อความเมื่อเกินลิมิต
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Comment Rate Limiting - สำหรับการแสดงความคิดเห็น (30 ครั้ง ต่อ ชั่วโมง)
const commentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,   // หน้าต่างเวลา: 1 ชั่วโมง
  max: 30,                    // จำนวนครั้งสูงสุด: 30 comments per IP
  message: {
    ok: false,
    message: "แสดงความคิดเห็นมากเกินไป กรุณาชะลอการโพสต์" // ข้อความเมื่อเกินลิมิต
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Report Rate Limiting - สำหรับการรายงาน (5 ครั้ง ต่อ วัน)
const reportLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // หน้าต่างเวลา: 24 ชั่วโมง
  max: 5,                         // จำนวนครั้งสูงสุด: 5 reports per IP
  message: {
    ok: false,
    message: "รายงานมากเกินไปในวันนี้ กรุณาลองใหม่พรุ่งนี้" // ข้อความเมื่อเกินลิมิต
  },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = {
  generalLimiter,
  authLimiter,
  createLimiter,
  commentLimiter,
  reportLimiter
};