import "dotenv/config";
import bcrypt from "bcryptjs";
import prisma from "./client.js";

// Ye script sirf EK admin account banata hai.
// Agar admin pehle se exist karta hai to dobara nahi banega (safe hai bar bar chalane ke liye).
//
// Chalane ka tareeqa:
//   cd server
//   npm run seed
//
// Chahen to admin ki details .env file mein ya command ke sath set kar sakte hain:
//   ADMIN_NAME="Ali Khan" ADMIN_EMAIL="admin@crm.com" ADMIN_PASSWORD="ChangeThis123!" npm run seed

async function main() {
  const existingAdmin = await prisma.user.findFirst({ where: { role: "admin" } });

  if (existingAdmin) {
    console.log(`Admin pehle se maujood hai: ${existingAdmin.email}. Naya admin nahi banaya gaya.`);
    return;
  }

  const name = process.env.ADMIN_NAME || "Admin";
  const email = process.env.ADMIN_EMAIL || "admin@crm.com";
  const password = process.env.ADMIN_PASSWORD || "Admin@123";

  const existingUserWithEmail = await prisma.user.findUnique({ where: { email } });
  if (existingUserWithEmail) {
    console.log(
      `"${email}" email se ek user pehle se maujood hai lekin admin nahi hai. Is user ko admin bana raha hoon...`
    );
    const updated = await prisma.user.update({
      where: { email },
      data: { role: "admin" },
    });
    console.log(`"${updated.email}" ab admin ban gaya hai.`);
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.user.create({
    data: { name, email, password: hashedPassword, role: "admin" },
  });

  console.log("Admin account create ho gaya:");
  console.log(`  Email:    ${admin.email}`);
  console.log(`  Password: ${password}`);
  console.log("Pehli login ke baad password zaroor change kar lein.");
}

main()
  .catch((err) => {
    console.error("Seed fail ho gaya:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
