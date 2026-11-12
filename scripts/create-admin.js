const { PrismaClient } = require("@prisma/client");
const crypto = require("crypto");

const prisma = new PrismaClient();

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
  return `pbkdf2:${salt}:${derivedKey}`;
}

async function main() {
  const email = (process.argv[2] || process.env.ADMIN_EMAIL || "admin@messagehub.in").toLowerCase().trim();
  const password = process.argv[3] || process.env.ADMIN_PASSWORD || "Admin@123";
  const name = process.argv[4] || "Super Administrator";

  console.log("\n==========================================");
  console.log(" SMS UNMUKT - PROVISION SUPER ADMINISTRATOR");
  console.log("==========================================");
  console.log(`Email:    ${email}`);
  console.log(`Password: ${password}`);
  console.log(`Name:     ${name}\n`);

  const passwordHash = hashPassword(password);

  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    const updated = await prisma.user.update({
      where: { email },
      data: {
        passwordHash,
        role: "SUPER_ADMIN",
        name,
      },
    });
    console.log(`✓ Updated existing user "${updated.email}" to SUPER_ADMIN with new password.`);
  } else {
    const created = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        role: "SUPER_ADMIN",
      },
    });
    console.log(`✓ Successfully created SUPER_ADMIN user: ${created.email} (ID: ${created.id})`);
  }

  console.log("\nYou can now sign in at /admin/login with:");
  console.log(`  Email:    ${email}`);
  console.log(`  Password: ${password}\n`);
}

main()
  .catch((e) => {
    console.error("Error creating admin:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
