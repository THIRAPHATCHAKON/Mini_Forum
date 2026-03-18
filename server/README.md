# 🚀 Web Board Database - Backend Server

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.x-blue.svg)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.x-blueviolet.svg)](https://prisma.io/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-orange.svg)](https://mysql.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0+-green.svg)](https://mongodb.com/)

## 📋 คำอธิบายโครงการ

เซิร์ฟเวอร์หลังบ้าน (Backend) สำหรับระบบกระดานสนทนา (Web Board) ที่สร้างด้วย Node.js, Express.js และใช้ฐานข้อมูล 2 แบบ:
- **MySQL** (ผ่าน Prisma ORM) - เก็บข้อมูลหลัก: ผู้ใช้, กระทู้, คอมเมนต์
- **MongoDB** (ผ่าน Mongoose) - เก็บข้อมูล logs และ reports

## ✨ ฟีเจอร์หลัก

### 🔐 ระบบจัดการผู้ใช้
- ✅ สมัครสมาชิก / เข้าสู่ระบบ
- ✅ JWT Authentication
- ✅ บทบาทผู้ใช้ (User / Admin)
- ✅ การจัดการโปรไฟล์
- ✅ อัพโหลดรูปอวตาร์

### 💬 ระบบกระทู้และคอมเมนต์
- ✅ สร้าง, อ่าน, แก้ไข, ลบกระทู้
- ✅ ระบบคอมเมนต์ แบบ Real-time
- ✅ อัพโหลดรูปภาพประกอบ
- ✅ ระบบแท็ก (Tags)
- ✅ การจัดหมวดหมู่

### 📊 ระบบจัดการ (Admin)
- ✅ Dashboard สำหรับ Admin
- ✅ จัดการสิทธิ์ผู้ใช้
- ✅ จัดการหมวดหมู่
- ✅ ดูรายงานกระทู้
- ✅ Activity Logs

### 🛡️ ระบบความปลอดภัย
- ✅ Rate Limiting (จำกัดจำนวนการเรียก API)
- ✅ Helmet.js (Security Headers)
- ✅ CORS Configuration
- ✅ Input Validation
- ✅ Password Hashing (bcrypt)

### ⚡ การเพิ่มประสิทธิภาพ
- ✅ Response Compression
- ✅ Static File Caching
- ✅ Database Query Optimization
- ✅ Memory Caching สำหรับข้อมูลที่เข้าถึงบ่อย
- ✅ Batch Processing สำหรับ Activity Logs

## 🏗️ สถาปัตยกรรม

```
server/
├── src/
│   ├── index.js              # 🚀 Server หลัก + API Routes
│   └── models/
│       ├── ActivityLog.js    # 📊 MongoDB Model สำหรับ Activity Logs
│       └── Report.js         # 🚨 MongoDB Model สำหรับ Reports
├── prisma/
│   ├── schema.prisma         # 🗄️ Database Schema (MySQL)
│   ├── seed.js              # 🌱 ข้อมูลเริ่มต้น
│   └── migrations/          # 📋 Database Migrations
├── static/                  # 📁 ไฟล์ Static
│   ├── avatars/            # 👤 รูปโปรไฟล์
│   ├── thread_images/      # 🖼️ รูปกระทู้
│   └── comment_images/     # 💬 รูปคอมเมนต์
├── package.json            # 📦 Dependencies
├── .env.example           # 🔧 ตัวอย่าง Environment Variables
└── Dockerfile            # 🐳 Docker Configuration
```

## 🛠️ เทคโนโลยีที่ใช้

| เทคโนโลジี | เวอร์ชัน | วัตถุประสงค์ |
|------------|----------|-------------|
| **Node.js** | 18+ | JavaScript Runtime |
| **Express.js** | ^4.18.0 | Web Framework |
| **Prisma** | ^5.0.0 | ORM สำหรับ MySQL |
| **Mongoose** | ^8.0.0 | ODM สำหรับ MongoDB |
| **bcryptjs** | ^2.4.3 | Password Hashing |
| **jsonwebtoken** | ^9.0.0 | JWT Authentication |
| **multer** | ^1.4.5 | File Upload Handler |
| **express-rate-limit** | ^7.0.0 | Rate Limiting |
| **helmet** | ^7.0.0 | Security Headers |
| **compression** | ^1.7.4 | Response Compression |
| **cors** | ^2.8.5 | Cross-Origin Resource Sharing |

## ⚙️ การติดตั้งและเรียกใช้งาน

### 📋 ความต้องการของระบบ
- Node.js 18 หรือสูงกว่า
- MySQL 8.0 หรือสูงกว่า
- MongoDB 6.0 หรือสูงกว่า
- npm หรือ yarn

### 🚀 ขั้นตอนการติดตั้ง

1. **โคลนโปรเจค**
   ```bash
   git clone <repository-url>
   cd Web_Broad_DataBase/server
   ```

2. **ติดตั้ง Dependencies**
   ```bash
   npm install
   ```

3. **ตั้งค่า Environment Variables**
   ```bash
   cp .env.example .env
   ```
   
   แก้ไขไฟล์ `.env`:
   ```env
   # Database URLs
   DATABASE_URL="mysql://username:password@localhost:3306/webboard"
   MONGODB_URI="mongodb://localhost:27017/webboard"
   
   # JWT Secret
   JWT_SECRET="your-super-secret-jwt-key"
   
   # Server Configuration
   PORT=3000
   NODE_ENV=development
   ```

4. **ตั้งค่าฐานข้อมูล**
   ```bash
   # Generate Prisma Client
   npx prisma generate
   
   # Run Database Migrations
   npx prisma migrate dev
   
   # Seed Database (ข้อมูลเริ่มต้น)
   npx prisma db seed
   ```

5. **เริ่มต้นเซิร์ฟเวอร์**
   ```bash
   # Development Mode
   npm run dev
   
   # Production Mode
   npm start
   ```

6. **ตรวจสอบการทำงาน**
   ```bash
   curl http://localhost:3000/api/health
   ```

## 📡 API Documentation

### 🔐 Authentication Endpoints

#### POST `/api/register`
สมัครสมาชิกใหม่

**Request Body:**
```json
{
  "username": "testuser",
  "email": "test@example.com", 
  "password": "password123"
}
```

**Response:**
```json
{
  "ok": true,
  "message": "สมัครสมาชิกสำเร็จ",
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "role": "user",
    "avatarUrl": "/static/avatars/default.png"
  }
}
```

#### POST `/api/login`
เข้าสู่ระบบ

**Request Body:**
```json
{
  "username": "testuser",
  "password": "password123"
}
```

**Response:**
```json
{
  "ok": true,
  "message": "เข้าสู่ระบบสำเร็จ",
  "user": {
    "id": 1,
    "username": "testuser", 
    "email": "test@example.com",
    "role": "user",
    "token": "jwt-token-here"
  }
}
```

### 💬 Thread Endpoints

#### GET `/api/threads`
ดึงรายการกระทู้

**Query Parameters:**
- `category` (optional) - กรองตามหมวดหมู่
- `page` (optional) - หมายเลขหน้า (default: 1)
- `limit` (optional) - จำนวนรายการต่อหน้า (default: 20)

**Response:**
```json
{
  "ok": true,
  "items": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

#### POST `/api/threads`
สร้างกระทู้ใหม่

**Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
- `title` - หัวข้อกระทู้
- `body` - เนื้อหากระทู้
- `tags` (optional) - แท็ก
- `categoryId` - ID หมวดหมู่
- `cover` (optional) - ไฟล์รูปปก

#### GET `/api/threads/:id`
ดึงข้อมูลกระทู้ตาม ID

#### DELETE `/api/threads/:id`
ลบกระทู้ (เจ้าของหรือ Admin เท่านั้น)

### 💭 Comment Endpoints

#### GET `/api/threads/:id/comments`
ดึงคอมเมนต์ของกระทู้

**Query Parameters:**
- `page` (optional) - หมายเลขหน้า (default: 1)
- `limit` (optional) - จำนวนรายการต่อหน้า (default: 50)

#### POST `/api/threads/:id/comments`
เพิ่มคอมเมนต์ใหม่

#### PUT `/api/comments/:id`
แก้ไขคอมเมนต์

#### DELETE `/api/comments/:id`
ลบคอมเมนต์

### 👥 Admin Endpoints

#### GET `/api/admin/dashboard`
ดึงข้อมูล Dashboard (Admin เท่านั้น)

#### GET `/api/users`
ดึงรายการผู้ใช้ทั้งหมด (Admin เท่านั้น)

#### PATCH `/api/users/:id/role`
เปลี่ยนสิทธิ์ผู้ใช้ (Admin เท่านั้น)

### 🚨 Report Endpoints

#### GET `/api/reports`
ดึงรายการรายงาน (Admin เท่านั้น)

#### POST `/api/reports`
รายงานกระทู้

#### DELETE `/api/reports/:id`
ลบรายงาน (Admin เท่านั้น)

### 🏥 Health Check

#### GET `/api/health`
ตรวจสอบสถานะเซิร์ฟเวอร์

```json
{
  "ok": true,
  "time": "2025-01-15T10:30:00.000Z",
  "status": "Server is running"
}
```

## 🔒 Rate Limiting

เซิร์ฟเวอร์มีระบบ Rate Limiting เพื่อป้องกันการโจมตี:

| ประเภท | จำกัด | หน้าต่างเวลา |
|--------|-------|--------------|
| **General API** | 100 requests | 15 นาที |
| **Authentication** | 5 attempts | 15 นาที |
| **สร้างกระทู้** | 10 posts | 1 ชั่วโมง |
| **คอมเมนต์** | 30 comments | 1 ชั่วโมง |
| **รายงาน** | 5 reports | 1 วัน |

## 📊 Database Schema

### 👤 User Table (MySQL)
```sql
CREATE TABLE User (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(191) UNIQUE NOT NULL,
  username VARCHAR(191) UNIQUE,
  passHash VARCHAR(191) NOT NULL,
  role VARCHAR(191) DEFAULT 'user',
  avatarUrl VARCHAR(191) DEFAULT '/static/avatars/default.png',
  bio TEXT,
  socialLink VARCHAR(191),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 💬 Thread Table (MySQL)
```sql
CREATE TABLE Thread (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(191) NOT NULL,
  body TEXT NOT NULL,
  tags VARCHAR(191),
  coverUrl VARCHAR(191),
  authorId INT NOT NULL,
  categoryId INT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (authorId) REFERENCES User(id),
  FOREIGN KEY (categoryId) REFERENCES Category(id)
);
```

### 💭 Comment Table (MySQL)
```sql
CREATE TABLE Comment (
  id INT PRIMARY KEY AUTO_INCREMENT,
  body TEXT NOT NULL,
  imageUrl VARCHAR(191),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  threadId INT NOT NULL,
  authorId INT NOT NULL,
  FOREIGN KEY (threadId) REFERENCES Thread(id) ON DELETE CASCADE,
  FOREIGN KEY (authorId) REFERENCES User(id) ON DELETE CASCADE
);
```

### 📂 Category Table (MySQL)
```sql
CREATE TABLE Category (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(191) UNIQUE NOT NULL
);
```

### 📊 Activity Log Collection (MongoDB)
```javascript
{
  userId: Number,      // ID ของผู้ใช้
  username: String,    // ชื่อผู้ใช้
  action: String,      // ประเภทการกระทำ
  details: String,     // รายละเอียด
  ip: String,          // IP Address
  timestamp: Date      // วันเวลา
}
```

### 🚨 Report Collection (MongoDB)
```javascript
{
  threadId: Number,        // ID กระทู้ที่ถูกรายงาน
  threadTitle: String,     // หัวข้อกระทู้
  reporterId: Number,      // ID ผู้รายงาน
  reporterEmail: String,   // Email ผู้รายงาน
  reason: String,          // เหตุผลการรายงาน
  createdAt: Date          // วันที่รายงาน
}
```

## 🐳 Docker Support

### Dockerfile
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npx prisma generate
EXPOSE 3000
CMD ["npm", "start"]
```

### การรัน Docker
```bash
# Build Image
docker build -t webboard-backend .

# Run Container
docker run -p 3000:3000 \
  -e DATABASE_URL="mysql://user:pass@host:3306/db" \
  -e MONGODB_URI="mongodb://host:27017/db" \
  -e JWT_SECRET="your-secret" \
  webboard-backend
```

## 📝 Scripts ที่มีให้ใช้งาน

```json
{
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js", 
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:seed": "prisma db seed",
    "db:studio": "prisma studio"
  }
}
```

## 🔧 การ Configuration

### Environment Variables
| Variable | คำอธิบาย | ตัวอย่าง |
|----------|----------|----------|
| `DATABASE_URL` | MySQL Connection String | `mysql://user:pass@localhost:3306/webboard` |
| `MONGODB_URI` | MongoDB Connection String | `mongodb://localhost:27017/webboard` |
| `JWT_SECRET` | JWT Signing Secret | `your-super-secret-key` |
| `PORT` | Server Port | `3000` |
| `NODE_ENV` | Environment | `development` หรือ `production` |

### Prisma Configuration
```javascript
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

## 🚨 การ Error Handling

เซิร์ฟเวอร์มีระบบจัดการ Error ที่ครอบคลุม:

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (ข้อมูลไม่ถูกต้อง)
- `401` - Unauthorized (ไม่ได้เข้าสู่ระบบ)
- `403` - Forbidden (ไม่มีสิทธิ์เข้าถึง)
- `404` - Not Found (ไม่พบข้อมูล)
- `409` - Conflict (ข้อมูลซ้ำ)
- `429` - Too Many Requests (Rate Limit)
- `500` - Internal Server Error

### Error Response Format
```json
{
  "ok": false,
  "message": "คำอธิบายข้อผิดพลาด"
}
```

## 📈 การติดตามประสิทธิภาพ

### Activity Logging
- การเข้าสู่ระบบ / ออกจากระบบ
- การสร้าง / แก้ไข / ลบกระทู้
- การแสดงความคิดเห็น
- การรายงานกระทู้
- การเปลี่ยนแปลงสิทธิ์

### Caching Strategy
- **Memory Caching**: กระทู้และหมวดหมู่ที่เข้าถึงบ่อย (5 นาที)
- **Static File Caching**: รูปภาพและไฟล์ static (7 วัน)
- **Database Query Optimization**: ใช้ Prisma select เฉพาะฟิลด์ที่ต้องการ

## 🔍 การ Debug และ Monitoring

### Logging
```javascript
// Development Mode
console.log('Query:', query);
console.log('Response:', response);

// Production Mode
// Log เฉพาะ errors และ warnings
```

### Health Monitoring
```bash
# ตรวจสอบสถานะเซิร์ฟเวอร์
curl http://localhost:3000/api/health

# ตรวจสอบ Database Connection
npx prisma db push --preview-feature
```

## 🤝 การพัฒนาและการบริจาค

### Code Style
- ใช้ ESLint สำหรับ JavaScript linting
- Comment ด้วยภาษาไทยเพื่อความเข้าใจ
- ใช้ Async/Await แทน Callbacks
- Error Handling ที่ครอบคลุม

### การทำ Pull Request
1. Fork repository
2. สร้าง feature branch
3. เขียน tests (ถ้ามี)
4. เขียน documentation
5. ส่ง Pull Request

## 📞 การติดต่อและการสนับสนุน

- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Documentation**: [Wiki](https://github.com/your-repo/wiki)
- **Email**: your-email@example.com

## 📄 License

MIT License - ดูรายละเอียดใน [LICENSE](LICENSE) file

---

## 🎯 สรุป

Backend Server นี้เป็นระบบที่มีประสิทธิภาพสูง ปลอดภัย และพร้อมสำหรับการใช้งานจริง พร้อมด้วยฟีเจอร์ครบครันสำหรับระบบกระดานสนทนาสมัยใหม่

**สร้างด้วย ❤️ โดยทีมพัฒนา Web Board Database**