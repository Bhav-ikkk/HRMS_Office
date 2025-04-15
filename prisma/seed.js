const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@hrms.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@hrms.com',
      role: 'ADMIN',
      password: hashedPassword,
      department: {
        create:{
            name : "HR"
        }
      }
    },
  });

  console.log('✅ Admin created:', admin);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
