import { PrismaClient } from '@prisma/client';

try {
  const prisma = new PrismaClient();
  console.log("Instantiated successfully");
} catch (e) {
  console.error("Error:", e);
}
