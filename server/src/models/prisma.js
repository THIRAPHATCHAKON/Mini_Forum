const { PrismaClient } = require("@prisma/client"); 

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL 
    }
  },
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error']
});

module.exports = prisma;