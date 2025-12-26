import prisma from "../db/prisma";

async function main() {
  const business = await prisma.business.create({
    data: {
      name: "Demo Business",
      agents: {
        create: [
          { name: "Alice", department: "Sales" },
          { name: "Bob", department: "Support" },
          { name: "Charlie", department: "Billing" },
        ],
      },
    },
  });

  console.log("Business ", business.id);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
