const auth = require("./function/auth");
const { uploadDirs, threadStorage, avatarStorage, uploadCommentImage } = require("./function/multer");
const { generalLimiter, authLimiter, createLimiter, commentLimiter, reportLimiter } = require("./function/rate_limit");
const { processBatch, saveLog } = require("./function/batch");
const prisma = require("./models/prisma");
const Report = require("./models/Report");
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const compression = require("compression");
const helmet = require("helmet");
const ActivityLog = require("./models/ActivityLog");
const BATCH_TIMEOUT = 5000; // 5 seconds
const threadCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const app = express();
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/miniforum");

function clearThreadCache() {
  for (const key of threadCache.keys()) {
    if (key.startsWith('thread_') || key.startsWith('threads_')) {
      threadCache.delete(key);
    }
  }
}

function clearCommentCache(threadId) {
  for (const key of threadCache.keys()) {
    if (key.startsWith(`comments_${threadId}_`)) {
      threadCache.delete(key);
    }
  }
}

// Security Headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:", "http://localhost:*"],
      connectSrc: ["'self'", "http://localhost:*"],
      fontSrc: ["'self'", "https://cdn.jsdelivr.net"],
    },
  },
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Response Compression
app.use(compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) return false;
    return compression.filter(req, res);
  },
  level: 6,
  threshold: 1024
}));

// CORS Configuration 
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  exposedHeaders: ["X-RateLimit-Limit", "X-RateLimit-Remaining", "X-RateLimit-Reset"]
}));

// Static File Serving 
app.use("/static", express.static(path.join(__dirname, "../static"), {
  maxAge: process.env.NODE_ENV === 'production' ? '7d' : '1h',
  etag: true,
  lastModified: true,
  setHeaders: (res, path, stat) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');

    if (path.endsWith('.jpg') || path.endsWith('.jpeg') || path.endsWith('.png') || path.endsWith('.gif')) {
      res.setHeader('Cache-Control', 'public, max-age=604800');
    }
  }
}));

app.use('/api', generalLimiter);
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

// จัดการ preflight OPTIONS requests สำหรับ CORS
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');
    return res.sendStatus(200); // ส่งสถานะ OK กลับ
  }
  next(); 
});

Object.values(uploadDirs).forEach(dir => fs.mkdirSync(dir, { recursive: true }));

// สร้าง multer instances สำหรับการอัปโหลดไฟล์ประเภทต่างๆ
const uploadThread = multer({ storage: threadStorage });
const uploadAvatar = multer({ storage: avatarStorage });

// API ตรวจสอบสถานะเซิร์ฟเวอร์ (ไม่มี rate limiting)
app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    time: new Date().toISOString(),
    status: 'Server is running'
  });
});


// API สมัครสมาชิกใหม่
app.post("/api/register", authLimiter, async (req, res) => {
  try {
    const { username, email, password } = req.body || {};

    if (!username || !email || !password) {
      return res.status(400).json({ ok: false, message: "กรุณากรอกข้อมูลให้ครบถ้วน" });
    }

    if (password.length < 6) {
      return res.status(400).json({ ok: false, message: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร" });
    }
    const passHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        username,
        email,
        passHash,
        role: "user",
        avatarUrl: "/static/avatars/default.png",
      },
      select: { id: true, username: true, email: true, role: true, avatarUrl: true },
    });

    await saveLog(user.id, user.username, 'register', 'สมัครสมาชิกใหม่', req);
    return res.json({ ok: true, message: "สมัครสมาชิกสำเร็จ", user });
  } catch (err) {
    // จัดการ error ข้อมูลซ้ำ (unique constraint)
    if (err.code === "P2002") {
      const field = err.meta?.target?.[0] || "ข้อมูล";
      return res.status(409).json({ ok: false, message: `${field} นี้ถูกใช้แล้ว` });
    }
    console.error(err);
    return res.status(500).json({ ok: false, message: "server error" });
  }
});

setInterval(processBatch, BATCH_TIMEOUT);

app.post("/api/login", authLimiter, async (req, res) => {
  const { username, password } = req.body || {};
  const user = await prisma.user.findFirst({ where: { username } });
  if (!user) return res.status(401).json({ ok: false, message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" });

  const ok = await bcrypt.compare(password, user.passHash);
  if (!ok) return res.status(401).json({ ok: false, message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" });

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || "changeme",
    { expiresIn: "7d" }
  );

  await saveLog(user.id, user.username, 'login', 'เข้าสู่ระบบ', req);

  res.json({
    ok: true,
    redirectTo: "/thread",
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      username: user.username,
      avatarUrl: user.avatarUrl || "/static/avatars/default.png",
      bio: user.bio || "",
      socialLink: user.socialLink || "",
      token
    },
  });
});

// API ดึงรายการกระทู้ทั้งหมด หรือกรองตามหมวดหมู่ - พร้อม caching และ pagination
app.get("/api/threads", async (req, res) => {
  try {
    const categoryId = req.query.category ? parseInt(req.query.category, 10) : null;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20; // Default 20 items per page
    const skip = (page - 1) * limit;
    const cacheKey = `threads_${categoryId || 'all'}_${page}_${limit}`;

    if (threadCache.has(cacheKey)) {
      const cached = threadCache.get(cacheKey);
      if (Date.now() - cached.timestamp < CACHE_DURATION) {
        return res.json(cached.data);
      }
      threadCache.delete(cacheKey);
    }

    const where = categoryId ? { categoryId } : {};

    const [items, total] = await Promise.all([
      prisma.thread.findMany({
        where,
        include: {
          author: {
            select: { id: true, email: true, username: true, avatarUrl: true }
          },
          _count: {
            select: { comments: true }
          }
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: skip
      }),
      prisma.thread.count({ where })
    ]);

    const response = {
      ok: true,
      items,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };

    threadCache.set(cacheKey, {
      data: response,
      timestamp: Date.now()
    });

    res.json(response);
  } catch (error) {
    console.error('Error fetching threads:', error);
    res.status(500).json({ ok: false, message: "เกิดข้อผิดพลาดในการดึงข้อมูลกระทู้" });
  }
});

// API สร้างกระทู้ใหม่ - พร้อม rate limiting
app.post("/api/threads", createLimiter, uploadThread.single("cover"), async (req, res) => {
  const { title, body, tags, categoryId } = req.body;
  try {
    const userId = parseInt(req.body.userId, 10);
    const catId = categoryId ? parseInt(categoryId, 10) : null;
    if (!title?.trim() || !body?.trim() || Number.isNaN(userId) || !catId) {
      return res.status(400).json({ ok: false, message: "invalid input" });
    }

    const thread = await prisma.thread.create({
      data: {
        title: title.trim(),
        body: body.trim(),
        tags: tags?.trim() || null,
        authorId: userId,
        coverUrl: req.file ? `/static/thread_images/${req.file.filename}` : null,
        categoryId: catId
      },
      include: {
        author: {
          select: { id: true, username: true, email: true, avatarUrl: true }
        }
      }
    });

    await saveLog(userId, thread.author.username, 'create_thread', `สร้างกระทู้: ${title}`, req);

    clearThreadCache();

    res.json({ ok: true, thread });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: "สร้างกระทู้ไม่สำเร็จ" });
  }
});

// เสิร์ฟไฟล์ static จาก React build (production mode)
const distPath = path.join(__dirname, "../../client/dist");
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get("/*", (req, res) => {
    if (req.path.startsWith("/api/")) return res.status(404).end();
    res.sendFile(path.join(distPath, "index.html"));
  });
}


// API ดึงข้อมูลกระทู้ตาม ID พร้อมข้อมูลผู้เขียน - พร้อม caching
app.get("/api/threads/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) return res.status(400).json({ ok: false, message: "bad id" });

    const cacheKey = `thread_${id}`;

    if (threadCache.has(cacheKey)) {
      const cached = threadCache.get(cacheKey);
      if (Date.now() - cached.timestamp < CACHE_DURATION) {
        return res.json(cached.data);
      }
      threadCache.delete(cacheKey);
    }

    const t = await prisma.thread.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, email: true, username: true, avatarUrl: true }
        },
        _count: {
          select: { comments: true }
        }
      },
    });

    if (!t) return res.status(404).json({ ok: false, message: "not found" });

    const response = { ok: true, thread: t };

    threadCache.set(cacheKey, {
      data: response,
      timestamp: Date.now()
    });

    res.json(response);
  } catch (error) {
    console.error('Error fetching thread:', error);
    res.status(500).json({ ok: false, message: "เกิดข้อผิดพลาดในการดึงข้อมูลกระทู้" });
  }
});

// API ลบกระทู้ - เฉพาะเจ้าของหรือ admin เท่านั้น
app.delete("/api/threads/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const auth = req.headers.authorization || "";
  const token = auth.replace(/^Bearer\s+/i, "");
  let user = null;
  try {

    user = jwt.verify(token, process.env.JWT_SECRET || "changeme");
  } catch {
    return res.status(401).json({ ok: false, message: "Invalid token" });
  }

  const thread = await prisma.thread.findUnique({ where: { id } });
  if (!thread) return res.status(404).json({ ok: false, message: "not found" });

  if (thread.authorId !== user.id && user.role !== "admin") {
    return res.status(403).json({ ok: false, message: "no permission" });
  }
  await prisma.comment.deleteMany({ where: { threadId: id } });
  await prisma.thread.delete({ where: { id } });
  clearThreadCache();

  res.json({ ok: true });
});

// API ดึงคอมเมนต์ทั้งหมดของกระทู้ - พร้อม pagination และ caching
app.get("/api/threads/:id/comments", async (req, res) => {
  try {
    const threadId = parseInt(req.params.id, 10);
    if (Number.isNaN(threadId)) return res.status(400).json({ ok: false, message: "bad id" });

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50; // Default 50 comments per page
    const skip = (page - 1) * limit;

    const cacheKey = `comments_${threadId}_${page}_${limit}`;

    if (threadCache.has(cacheKey)) {
      const cached = threadCache.get(cacheKey);
      if (Date.now() - cached.timestamp < CACHE_DURATION) {
        return res.json(cached.data);
      }
      threadCache.delete(cacheKey);
    }

    const threadCacheKey = `thread_${threadId}`;
    let thread = null;

    if (threadCache.has(threadCacheKey)) {
      const cached = threadCache.get(threadCacheKey);
      if (Date.now() - cached.timestamp < CACHE_DURATION) {
        thread = cached.data.thread;
      }
    }

    if (!thread) {
      thread = await prisma.thread.findUnique({ where: { id: threadId } });
      if (!thread) return res.status(404).json({ ok: false, message: "ไม่พบกระทู้" });
    }

    const [items, total] = await Promise.all([
      prisma.comment.findMany({
        where: { threadId },
        include: {
          author: {
            select: { id: true, username: true, email: true, avatarUrl: true }
          }
        },
        orderBy: { createdAt: "asc" },
        take: limit,
        skip: skip
      }),
      prisma.comment.count({ where: { threadId } })
    ]);

    const response = {
      ok: true,
      items,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };

    threadCache.set(cacheKey, {
      data: response,
      timestamp: Date.now()
    });

    res.json(response);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ ok: false, message: "เกิดข้อผิดพลาดในการดึงข้อมูลคอมเมนต์" });
  }
});

// ✅ API สร้างคอมเมนต์ใหม่ - พร้อม rate limiting
app.post("/api/threads/:id/comments", commentLimiter, uploadCommentImage.single("image"), async (req, res) => {
  try {
    const threadId = parseInt(req.params.id, 10);
    const { body } = req.body || {};

    const auth = req.headers.authorization || "";
    const token = auth.replace(/^Bearer\s+/i, "");
    let user = null;
    try {
      user = jwt.verify(token, process.env.JWT_SECRET || "changeme");
    } catch {
      return res.status(401).json({ ok: false, message: "Invalid token" });
    }

    if (!body?.trim() && !req.file) {
      return res.status(400).json({ ok: false, message: "ต้องมีข้อความหรือรูปภาพ" });
    }

    const thread = await prisma.thread.findUnique({ where: { id: threadId } });
    if (!thread) return res.status(404).json({ ok: false, message: "ไม่พบกระทู้" });

    const comment = await prisma.comment.create({
      data: {
        body: body?.trim() || "",
        imageUrl: req.file ? `/static/comment_images/${req.file.filename}` : null,
        threadId,
        authorId: user.id,
      },
      include: {
        author: { select: { id: true, username: true, email: true, avatarUrl: true } }
      }
    });

    await saveLog(user.id, comment.author.username, "create_comment", `แสดงความคิดเห็น: ${thread.title}`, req);

    clearCommentCache(threadId);

    res.json({ ok: true, comment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: "เกิดข้อผิดพลาด" });
  }
});

// API ลบคอมเมนต์ - เฉพาะเจ้าของหรือ admin
app.delete("/api/comments/:id", async (req, res) => {
  const commentId = parseInt(req.params.id, 10);
  if (Number.isNaN(commentId)) return res.status(400).json({ ok: false, message: "Invalid comment ID" });

  const auth = req.headers.authorization || "";
  const token = auth.replace(/^Bearer\s+/i, "");
  let user = null;
  try {
    user = jwt.verify(token, process.env.JWT_SECRET || "changeme");
  } catch {
    return res.status(401).json({ ok: false, message: "Unauthorized" });
  }

  try {
    const comment = await prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment) return res.status(404).json({ ok: false, message: "Comment not found" });

    if (comment.authorId !== user.id && user.role !== "admin") {
      return res.status(403).json({ ok: false, message: "Permission denied" });
    }

    if (comment.imageUrl) {
      try {
        const imagePath = path.join(__dirname, "..", comment.imageUrl);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      } catch (err) {
        console.log("Failed to delete comment image:", err.message);
      }
    }
    await prisma.comment.delete({ where: { id: commentId } });

    await saveLog(user.id, user.email, 'delete_comment', `ลบคอมเมนต์ ID: ${commentId}`, req);

    res.json({ ok: true, message: "ลบคอมเมนต์สำเร็จ" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
});

// API แก้ไขคอมเมนต์ - เฉพาะเจ้าของ
app.put("/api/comments/:id", uploadCommentImage.single("image"), async (req, res) => {
  const commentId = parseInt(req.params.id, 10);
  if (Number.isNaN(commentId)) return res.status(400).json({ ok: false, message: "Invalid comment ID" });

  const auth = req.headers.authorization || "";
  const token = auth.replace(/^Bearer\s+/i, "");
  let user = null;
  try {
    user = jwt.verify(token, process.env.JWT_SECRET || "changeme");
  } catch {
    return res.status(401).json({ ok: false, message: "Unauthorized" });
  }

  try {
    const existingComment = await prisma.comment.findUnique({ where: { id: commentId } });
    if (!existingComment) return res.status(404).json({ ok: false, message: "Comment not found" });

    if (existingComment.authorId !== user.id) {
      return res.status(403).json({ ok: false, message: "Permission denied" });
    }

    const { body } = req.body;

    if (!body?.trim() && !req.file) {
      return res.status(400).json({ ok: false, message: "Body or image is required" });
    }

    let updateData = {};

    if (body?.trim()) {
      updateData.body = body.trim();
    }

    if (req.file) {
      if (existingComment.imageUrl) {
        try {
          const oldImagePath = path.join(__dirname, "..", existingComment.imageUrl);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        } catch (err) {
          console.log("Failed to delete old comment image:", err.message);
        }
      }
      updateData.imageUrl = `/static/comment_images/${req.file.filename}`;
    }
    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: updateData,
      include: {
        author: {
          select: { id: true, username: true, email: true, avatarUrl: true }
        }
      }
    });
    await saveLog(user.id, user.email, 'edit_comment', `แก้ไขคอมเมนต์ ID: ${commentId}`, req);

    res.json({ ok: true, comment: updatedComment, message: "แก้ไขคอมเมนต์สำเร็จ" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
});

// API อัปเดตข้อมูลผู้ใช้ - username, bio, socialLink, avatar
app.patch("/api/users/:id", uploadAvatar.single("avatar"), async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { username, bio, socialLink } = req.body;

  try {
    let avatarUrl = undefined;
    if (req.file) {
      avatarUrl = `/static/avatars/${req.file.filename}`;
    }

    const user = await prisma.user.update({
      where: { id },
      data: {
        username: username || undefined,
        avatarUrl: avatarUrl || undefined,
        bio: bio || undefined,
        socialLink: socialLink || undefined
      },
      select: {
        id: true,
        email: true,
        username: true,
        avatarUrl: true,
        role: true,
        bio: true,
        socialLink: true
      }
    });

    res.json({ ok: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: "อัพเดตไม่สำเร็จ" });
  }
});

// API เปลี่ยนรหัสผ่าน - ต้องใส่รหัสเดิมก่อน
app.post("/api/users/:id/change-password", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { oldPassword, newPassword } = req.body || {};

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ ok: false, message: "ข้อมูลไม่ครบ" });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ ok: false, message: "รหัสผ่านใหม่อย่างน้อย 6 ตัวอักษร" });
  }

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return res.status(404).json({ ok: false, message: "ไม่พบผู้ใช้" });

  const ok = await bcrypt.compare(oldPassword, user.passHash);
  if (!ok) return res.status(401).json({ ok: false, message: "รหัสผ่านเดิมไม่ถูกต้อง" });

  const passHash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({ where: { id }, data: { passHash } });

  res.json({ ok: true, message: "เปลี่ยนรหัสผ่านสำเร็จ" });
});

// API ดึงรายการผู้ใช้ทั้งหมด - เฉพาะ admin
app.get("/api/users", async (req, res) => {
  const auth = req.headers.authorization || "";
  const token = auth.replace(/^Bearer\s+/i, "");
  let user = null;
  try {
    user = jwt.verify(token, process.env.JWT_SECRET || "changeme");
  } catch {
    return res.status(401).json({ ok: false, message: "Invalid token" });
  }
  if (user.role !== "admin") return res.status(403).json({ ok: false, message: "forbidden" });

  const users = await prisma.user.findMany({
    select: { id: true, email: true, username: true, role: true }
  });
  res.json({ ok: true, users });
});

// API เปลี่ยน role ของผู้ใช้ (user/admin) - เฉพาะ admin
app.patch("/api/users/:id/role", async (req, res) => {
  const auth = req.headers.authorization || "";
  const token = auth.replace(/^Bearer\s+/i, "");
  let user = null;
  try {
    user = jwt.verify(token, process.env.JWT_SECRET || "changeme");
  } catch {
    return res.status(401).json({ ok: false, message: "Invalid token" });
  }
  if (user.role !== "admin") return res.status(403).json({ ok: false, message: "forbidden" });

  const id = parseInt(req.params.id, 10);
  const { role } = req.body;
  if (!["user", "admin"].includes(role)) {
    return res.status(400).json({ ok: false, message: "role ไม่ถูกต้อง" });
  }

  try {
    await prisma.user.update({
      where: { id },
      data: { role }
    });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: "เปลี่ยน role ไม่สำเร็จ" });
  }
});

// API ดึงรายการหมวดหมู่ทั้งหมด
app.get("/api/categories", async (req, res) => {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  res.json(categories);
});

// API สร้างหมวดหมู่ใหม่ - เฉพาะ admin
app.post("/api/categories", auth, async (req, res) => {
  console.log("BODY", req.body, "USER", req.user);
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ ok: false, message: "forbidden" });
  }
  const { name } = req.body;
  if (!name) return res.status(400).json({ ok: false, message: "ต้องระบุชื่อหมวดหมู่" });
  const cat = await prisma.category.create({ data: { name } });
  res.json({ ok: true, category: cat });
});

// API ลบหมวดหมู่ - เฉพาะ admin
app.delete("/api/categories/:id", auth, async (req, res) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ ok: false, message: "forbidden" });
  }
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) return res.status(400).json({ ok: false, message: "bad id" });

  try {
    await prisma.category.delete({ where: { id } });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: "ลบหมวดหมู่ไม่สำเร็จ" });
  }
});

// ✅ API รายงานกระทู้ - พร้อม rate limiting
app.post("/api/reports", reportLimiter, async (req, res) => {
  const { threadId, threadTitle, reason } = req.body;
  const auth = req.headers.authorization || "";
  const token = auth.replace(/^Bearer\s+/i, "");
  let user = null;
  try {
    user = jwt.verify(token, process.env.JWT_SECRET || "changeme");
  } catch {
    return res.status(401).json({ ok: false, message: "Invalid token" });
  }
  if (!threadId || !reason) return res.status(400).json({ ok: false, message: "ข้อมูลไม่ครบ" });

  const report = await Report.create({
    threadId,
    threadTitle,
    reporterId: user.id,
    reporterEmail: user.email,
    reason
  });

  await saveLog(user.id, user.email, 'report', `รายงานกระทู้: ${threadTitle}`, req);

  res.json({ ok: true, report });
});

// API ดึงรายการรายงานทั้งหมด - เฉพาะ admin
app.get("/api/reports", async (req, res) => {
  const auth = req.headers.authorization || "";
  const token = auth.replace(/^Bearer\s+/i, "");
  let user = null;
  try {
    user = jwt.verify(token, process.env.JWT_SECRET || "changeme");
  } catch {
    return res.status(401).json({ ok: false, message: "Invalid token" });
  }
  if (user.role !== "admin") return res.status(403).json({ ok: false, message: "forbidden" });
  const reports = await Report.find().sort({ createdAt: -1 });
  res.json({ ok: true, reports });
});

// API แก้ไขรายงาน - เฉพาะ admin
app.put("/api/reports/:id", async (req, res) => {
  const auth = req.headers.authorization || "";
  const token = auth.replace(/^Bearer\s+/i, "");
  let user = null;
  try {
    user = jwt.verify(token, process.env.JWT_SECRET || "changeme");
  } catch {
    return res.status(401).json({ ok: false, message: "Invalid token" });
  }
  if (user.role !== "admin") return res.status(403).json({ ok: false, message: "forbidden" });

  const { reason } = req.body;
  if (!reason || !reason.trim()) {
    return res.status(400).json({ ok: false, message: "ต้องระบุเหตุผลในการรายงาน" });
  }

  try {
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { reason: reason.trim() },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({ ok: false, message: "ไม่พบรายงาน" });
    }

    res.json({ ok: true, report });
  } catch (error) {
    console.error("Error updating report:", error);
    res.status(500).json({ ok: false, message: "แก้ไขรายงานไม่สำเร็จ" });
  }
});

// API ลบรายงาน - เฉพาะ admin
app.delete("/api/reports/:id", async (req, res) => {
  const auth = req.headers.authorization || "";
  const token = auth.replace(/^Bearer\s+/i, "");
  let user = null;
  try {
    user = jwt.verify(token, process.env.JWT_SECRET || "changeme");
  } catch {
    return res.status(401).json({ ok: false, message: "Invalid token" });
  }
  if (user.role !== "admin") return res.status(403).json({ ok: false, message: "forbidden" });

  try {
    const report = await Report.findByIdAndDelete(req.params.id);

    if (!report) {
      return res.status(404).json({ ok: false, message: "ไม่พบรายงาน" });
    }

    res.json({ ok: true, message: "ลบรายงานสำเร็จ" });
  } catch (error) {
    console.error("Error deleting report:", error);
    res.status(500).json({ ok: false, message: "ลบรายงานไม่สำเร็จ" });
  }
});

// API ดึงข้อมูล dashboard สำหรับ admin - สถิติต่างๆ
app.get("/api/admin/dashboard", async (req, res) => {
  const auth = req.headers.authorization || "";
  const token = auth.replace(/^Bearer\s+/i, "");
  let user = null;
  try {
    user = jwt.verify(token, process.env.JWT_SECRET || "changeme");
  } catch {
    return res.status(401).json({ ok: false, message: "Invalid token" });
  }
  if (user.role !== "admin") return res.status(403).json({ ok: false, message: "forbidden" });

  const userCount = await prisma.user.count();
  const threadCount = await prisma.thread.count();

  const users = await prisma.user.findMany({
    select: { createdAt: true },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  const dailyUsersMap = new Map();
  users.forEach(user => {
    const date = user.createdAt.toISOString().slice(0, 10);
    dailyUsersMap.set(date, (dailyUsersMap.get(date) || 0) + 1);
  });

  const dailyUsers = Array.from(dailyUsersMap.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 7);

  res.json({
    ok: true,
    userCount,
    threadCount,
    dailyUsers
  });
});

// API ดู logs (เฉพาะ admin)
app.get("/api/logs", async (req, res) => {
  const auth = req.headers.authorization || "";
  const token = auth.replace(/^Bearer\s+/i, "");
  let user = null;
  try {
    user = jwt.verify(token, process.env.JWT_SECRET || "changeme");
  } catch {
    return res.status(401).json({ ok: false, message: "Invalid token" });
  }
  if (user.role !== "admin") return res.status(403).json({ ok: false, message: "forbidden" });

  const { page = 1, limit = 50 } = req.query;

  const logs = await ActivityLog.find()
    .sort({ timestamp: -1 })
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit));

  const total = await ActivityLog.countDocuments();

  res.json({
    ok: true,
    logs,
    pagination: { page: parseInt(page), limit: parseInt(limit), total }
  });
});

// API ยืนยันอีเมล - ตรวจสอบว่าอีเมลมีอยู่ในระบบหรือไม่ (สำหรับ Forgot Password Step 1)
app.post("/api/verify-email", authLimiter, async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        ok: false,
        message: "กรุณาระบุอีเมล"
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        ok: false,
        message: "รูปแบบอีเมลไม่ถูกต้อง"
      });
    }
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      select: { id: true, email: true, username: true } // เลือกเฉพาะข้อมูลที่จำเป็น
    });

    if (!user) {
      return res.status(404).json({
        ok: false,
        message: "ไม่พบอีเมลนี้ในระบบ กรุณาตรวจสอบความถูกต้อง"
      });
    }

    await ActivityLog.create({
      action: "email_verify_attempt",
      userId: user.id,
      email: user.email,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
      timestamp: new Date()
    });

    res.json({
      ok: true,
      message: "พบอีเมลในระบบ สามารถดำเนินการขั้นตอนถัดไป",
      email: email.toLowerCase().trim()
    });
  } catch (error) {
    console.error("Error in verify-email:", error);
    res.status(500).json({
      ok: false,
      message: "เกิดข้อผิดพลาดในการตรวจสอบอีเมล"
    });
  }
});

// API รีเซ็ตรหัสผ่าน - รับ email และรหัสผ่านใหม่ (Forgot Password Step 2)
app.post("/api/forgot-password", authLimiter, async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({
        ok: false,
        message: "กรุณาระบุอีเมลและรหัสผ่านใหม่"
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        ok: false,
        message: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"
      });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    });

    if (!user) {
      return res.status(404).json({
        ok: false,
        message: "ไม่พบผู้ใช้งานที่มีอีเมลนี้"
      });
    }

    const passHash = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { email: email.toLowerCase().trim() },
      data: {
        passHash
      }
    });

    await ActivityLog.create({
      action: "password_reset_success",
      userId: user.id,
      email: user.email,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
      timestamp: new Date()
    });

    res.json({
      ok: true,
      message: "รีเซ็ตรหัสผ่านสำเร็จ กรุณาเข้าสู่ระบบด้วยรหัสผ่านใหม่"
    });
  } catch (error) {
    console.error("Error in forgot-password:", error);
    res.status(500).json({
      ok: false,
      message: "เกิดข้อผิดพลาดในการรีเซ็ตรหัสผ่าน"
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
