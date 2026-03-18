const multer = require("multer");
const path = require('path'); // เพิ่มบรรทัดนี้
// สร้างโฟลเดอร์สำหรับเก็บไฟล์ที่อัปโหลด
const uploadDirs = {
  thread: path.join(__dirname, "../static/thread_images"),   
  avatar: path.join(__dirname, "../static/avatars")          
};

// ตั้งค่า multer สำหรับอัปโหลดรูปภาพกระทู้
const threadStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDirs.thread), 
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);               
    cb(null, `thread-${Date.now()}${ext}`);                  
  }
});

// ตั้งค่า multer สำหรับอัปโหลดรูปอวตาร์
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDirs.avatar), 
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);              
    cb(null, `avatar-${Date.now()}${ext}`);                 
  }
});

// ตั้งค่า multer สำหรับรูปภาพคอมเมนต์
const commentImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "../static/comment_images"); 
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });                  
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);                   
    const filename = `comment_${Date.now()}_${Math.random().toString(36).substring(7)}${ext}`;
    cb(null, filename);
  }
});

// สร้าง multer instance สำหรับรูปคอมเมนต์ พร้อมการตรวจสอบ
const uploadCommentImage = multer({
  storage: commentImageStorage,                
  limits: { fileSize: 5 * 1024 * 1024 },        
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {     
      cb(null, true);
    } else {
      cb(new Error('อนุญาตเฉพาะไฟล์รูปภาพเท่านั้น'), false);
    }
  }
});

module.exports = {
    uploadDirs,
    threadStorage,
    avatarStorage,
    uploadCommentImage
};