# Mini Forum

เว็บบอร์ดแบบง่าย พร้อมระบบจัดการผู้ใช้ หมวดหมู่ และการรายงาน

## 🔧 Requirements
- **Docker + Docker Compose** (สำหรับฐานข้อมูล)
- **Node.js 18+** (แนะนำ 20/22)
- **npm หรือ yarn**

## 🚀 การติดตั้งและรัน

### 1) เริ่มต้นฐานข้อมูล (MySQL + MongoDB + Web UI)
```bash
# รันคำสั่งใน project root
docker-compose up -d

# ตรวจสอบสถานะ
docker-compose ps
```

**เข้าถึง Database UI:**
- **MySQL Adminer:** http://localhost:8080 
  - Server: `db`, User: `root`, Password: `example`, Database: `mini_forum`
- **MongoDB Express:** http://localhost:8081
  - Database: `miniforum`

### 2) เซิร์ฟเวอร์ (Backend API)
```bash
cd server
cp env.example .env
npm install

# ตั้งค่าฐานข้อมูล MySQL
npx prisma migrate dev
npx prisma generate

# เพิ่มข้อมูลทดสอบ (ทางเลือก)
npm run db:seed     # สร้าง admin@example.com / 123456

# รันเซิร์ฟเวอร์
npm run dev         # API ที่ http://localhost:3000
```

### 3) เว็บไซต์ (Frontend)
```bash
cd client
npm install
npm run dev         # http://localhost:5173
```

## 📊 โครงสร้างฐานข้อมูล

### 🐬 MySQL Database (ข้อมูลหลัก)

#### **Users Table**
```sql
CREATE TABLE User (
  id        INT PRIMARY KEY AUTO_INCREMENT,
  username  VARCHAR(50) UNIQUE NOT NULL,
  email     VARCHAR(100) UNIQUE NOT NULL,
  passHash  VARCHAR(255) NOT NULL,
  role      ENUM('user', 'admin') DEFAULT 'user',
  avatarUrl VARCHAR(255),
  bio       TEXT,
  socialLink VARCHAR(255),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### **Categories Table**
```sql
CREATE TABLE Category (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  name        VARCHAR(100) NOT NULL,
  description TEXT,
  createdAt   DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### **Threads Table**
```sql
CREATE TABLE Thread (
  id         INT PRIMARY KEY AUTO_INCREMENT,
  title      VARCHAR(255) NOT NULL,
  body       TEXT NOT NULL,
  tags       VARCHAR(500),
  coverUrl   VARCHAR(255),
  authorId   INT NOT NULL,
  categoryId INT,
  createdAt  DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (authorId) REFERENCES User(id) ON DELETE CASCADE,
  FOREIGN KEY (categoryId) REFERENCES Category(id) ON DELETE SET NULL
);
```

#### **Comments Table**
```sql
CREATE TABLE Comment (
  id        INT PRIMARY KEY AUTO_INCREMENT,
  body      TEXT NOT NULL,
  imageUrl  VARCHAR(255),
  threadId  INT NOT NULL,
  authorId  INT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (threadId) REFERENCES Thread(id) ON DELETE CASCADE,
  FOREIGN KEY (authorId) REFERENCES User(id) ON DELETE CASCADE
);
```

### 🍃 MongoDB Database (Logs & Reports)

#### **ActivityLogs Collection**
```javascript
{
  _id: ObjectId,
  userId: Number,           // FK -> User.id (MySQL)
  username: String,
  action: String,           // "login", "register", "create_thread", etc.
  details: String,
  ip: String,
  timestamp: Date           // DEFAULT: NOW
}
```

#### **ErrorLogs Collection**
```javascript
{
  _id: ObjectId,
  level: String,            // "error", "warning", "info"
  message: String,
  stack: String,            // Stack trace
  endpoint: String,         // API endpoint
  method: String,           // HTTP method
  userId: Number,           // FK -> User.id (MySQL) [Optional]
  userAgent: String,
  ip: String,
  timestamp: Date           // DEFAULT: NOW
}
```

#### **Reports Collection**
```javascript
{
  _id: ObjectId,
  threadId: Number,         // FK -> Thread.id (MySQL)
  threadTitle: String,
  reporterId: Number,       // FK -> User.id (MySQL)
  reporterEmail: String,
  reason: String,
  timestamp: Date           // DEFAULT: NOW
}
```

## 🔗 ความสัมพันธ์ของข้อมูล

### MySQL Relations (หลัก)
```
User (1) ──┬── (N) Thread    [User.id ← Thread.authorId]
           └── (N) Comment   [User.id ← Comment.authorId]

Category (1) ── (N) Thread   [Category.id ← Thread.categoryId]

Thread (1) ── (N) Comment    [Thread.id ← Comment.threadId]
```

### Cross-Database Relations
```
MySQL.User.id ← MongoDB.ActivityLogs.userId
MySQL.User.id ← MongoDB.ErrorLogs.userId  
MySQL.User.id ← MongoDB.Reports.reporterId
MySQL.Thread.id ← MongoDB.Reports.threadId
```

## 📁 โครงสร้างโปรเจค
```
Web_Broad_DataBase/
├── docker-compose.yml          # MySQL + MongoDB + Web UI
├── server/                     # Backend API (Node.js)
│   ├── src/
│   │   ├── index.js           # Main server file
│   │   └── models/            # MongoDB models
│   │       ├── ActivityLog.js
│   │       ├── ErrorLog.js
│   │       └── Report.js
│   ├── prisma/
│   │   ├── schema.prisma      # MySQL database schema
│   │   └── migrations/        # Database migrations
│   ├── static/                # Uploaded files
│   │   ├── avatars/
│   │   ├── thread_images/
│   │   └── comment_images/
│   └── package.json
├── client/                     # Frontend (React + Vite)
│   ├── src/
│   │   ├── pages/            # React components
│   │   ├── auth.jsx          # Authentication context
│   │   └── main.jsx
│   └── package.json
└── README.md
```

## 🛠️ Scripts ที่มีใน package.json

### Server Scripts
```json
{
  "scripts": {
    "dev": "nodemon src/index.js",
    "start": "node src/index.js",
    "db:migrate": "prisma migrate dev",
    "db:seed": "prisma db seed",
    "db:studio": "prisma studio",
    "db:reset": "prisma migrate reset"
  },
  "prisma": {
    "seed": "node prisma/seed.js"
  }
}
```

### Client Scripts
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

## ✅ เช็คลิสต์ก่อนใช้งาน

### เช็คฐานข้อมูล
- [ ] `docker-compose ps` แสดง containers ทำงาน
- [ ] **Adminer** (http://localhost:8080) เข้าได้
- [ ] **Mongo Express** (http://localhost:8081) เข้าได้

### เช็คเซิร์ฟเวอร์
- [ ] `server/.env` มีค่าที่ถูกต้อง (ไม่ commit file นี้)
- [ ] `npx prisma migrate dev` ผ่าน
- [ ] `npm run db:seed` ผ่าน (ทางเลือก)
- [ ] `npm run dev` รันได้

### เช็คเว็บไซต์
- [ ] `client/npm run dev` รันได้
- [ ] เข้าเว็บได้ที่ http://localhost:5173

## 🔑 ข้อมูลทดสอบ (หลัง seed)

**Admin User:**
- Email: `admin@example.com`
- Password: `123456`
- Role: `admin`

**Regular User:**
- Email: `user@example.com`  
- Password: `123456`
- Role: `user`

## 🚀 การ Deploy ใหม่

```bash
# Clone project
git clone <YOUR_REPO_URL>
cd Web_Broad_DataBase

# เริ่ม databases
docker-compose up -d

# Setup server
cd server
cp env.example .env          # แก้ไขค่าตามต้องการ
npm install
npx prisma migrate dev
npm run db:seed              # ทางเลือก
npm run dev                  # หรือ npm start สำหรับ production

# Setup client (เทอร์มินัลใหม่)
cd client
npm install
npm run dev                  # หรือ npm run build สำหรับ production
```

## 🔧 Environment Variables

### server/.env
```env
# MySQL Database
DATABASE_URL="mysql://root:example@localhost:3306/mini_forum"

# MongoDB Database  
MONGO_URI="mongodb://root:example@localhost:27017/miniforum?authSource=admin"

# JWT Secret
JWT_SECRET="your-super-secret-jwt-key-change-in-production"

# Server Port
PORT=3000
```

## 📱 ฟีเจอร์หลัก

### 👥 ผู้ใช้งาน
- ✅ สมัครสมาชิก / เข้าสู่ระบบ
- ✅ แก้ไขโปรไฟล์ (รูปโปรไฟล์, bio, social link)
- ✅ ระบบ role (user, admin)

### 💬 กระทู้และคอมเมนต์
- ✅ สร้าง/แก้ไข/ลบกระทู้ (พร้อมรูปปก)
- ✅ แสดงความคิดเห็น (พร้อมรูปภาพ)
- ✅ หมวดหมู่กระทู้
- ✅ แท็กกระทู้

### 🛡️ การจัดการ (Admin)
- ✅ จัดการหมวดหมู่
- ✅ เปลี่ยนสิทธิ์ผู้ใช้
- ✅ ดูรายงานกระทู้
- ✅ ดู Activity Logs
- ✅ ดู Error Logs

### 📊 ระบบ Logging
- ✅ บันทึกกิจกรรมผู้ใช้ (เข้าสู่ระบบ, สร้างกระทู้, etc.)
- ✅ บันทึกข้อผิดพลาด (Error, Warning, Info)
- ✅ ระบบรายงานปัญหา

## 🎯 API Endpoints

### Authentication
- `POST /api/login` - เข้าสู่ระบบ
- `POST /api/register` - สมัครสมาชิก

### Threads
- `GET /api/threads` - ดูกระทู้ทั้งหมด
- `POST /api/threads` - สร้างกระทู้
- `PUT /api/threads/:id` - แก้ไขกระทู้
- `DELETE /api/threads/:id` - ลบกระทู้

### Comments
- `GET /api/threads/:id/comments` - ดูคอมเมนต์
- `POST /api/threads/:id/comments` - แสดงความคิดเห็น

### Admin
- `GET /api/admin/logs/activity` - ดู Activity Logs
- `GET /api/admin/logs/errors` - ดู Error Logs
- `GET /api/categories` - ดูหมวดหมู่
- `POST /api/categories` - สร้างหมวดหมู่

## 🌐 การใช้งานจริง

1. **เข้าระบบ** ด้วย admin@example.com / 123456
2. **สร้างหมวดหมู่** ใน Admin → จัดการหมวดหมู่  
3. **สร้างกระทู้** พร้อมเลือกหมวดหมู่
4. **แสดงความคิดเห็น** (ข้อความ + รูปภาพ)
5. **ดู Logs** ใน Admin → Logs

---

## 📞 Support
หากมีปัญหาการใช้งาน สามารถตรวจสอบ:
1. **Docker logs:** `docker-compose logs [service-name]`
2. **Server logs:** ดูใน terminal ที่รัน `npm run dev`
3. **Database:** ผ่าน Adminer หรือ Mongo Express
4. **Error Logs:** ผ่านหน้า Admin Logs

🎉 **Happy Coding!** 🎉
