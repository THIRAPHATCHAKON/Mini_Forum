# Mini Forum

This is my MiniProject. It's about DashBoard Forum

Docker
install Bulid Database Mysql and Mongodb
docker-compose up -d
docker-compose ps

- **MySQL Adminer:** http://localhost:8080 
  - Server: `db`, User: `root`, Password: `example`, Database: `mini_forum`
- **MongoDB Express:** http://localhost:8081
  - Database: `miniforum`

Backend API
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

เว็บไซต์ Frontend
```bash
cd client
npm install
npm run dev         # http://localhost:5173
```

