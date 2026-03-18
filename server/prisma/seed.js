const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const passHash = await bcrypt.hash('123456', 10);

  // สร้างแอดมินถ้ายังไม่มี
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {}, // ยังไม่อัปเดตอะไร
    create: {
      username: 'admin',              // ✅ ต้องมี
      email: 'admin@example.com',
      passHash,
      role: 'admin',
      avatarUrl: "http://localhost:3000/static/avatars/default.png"
    },
  });

  console.log('Seeded admin: admin@example.com / 123456');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
