import prisma from "../db/prisma";

async function main() {
  // Business seed
  const business = await prisma.business.create({
    data: {
      name: "Demo Business",
    },
  });

  // Departments seed
  const departmentNames = ["Sales", "Support", "Billing", "General"];
  const departments: Record<string, { id: string }> = {};

  for (const name of departmentNames) {
    const dept = await prisma.department.create({
      data: {
        name,
        businessId: business.id,
      },
    });
    departments[name] = dept;
  }

  // Create Admin
  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@demo.com",
      role: "admin",
      businessId: business.id,
    },
  });

  // Create Agents per department
  const agents: Record<string, { id: string }> = {};

  for (const deptName of departmentNames) {
    const agent = await prisma.user.create({
      data: {
        name: `${deptName} Agent`,
        email: `${deptName.toLowerCase()}@demo.com`,
        role: "agent",
        businessId: business.id,
        departmentId: departments[deptName].id,
      },
    });

    agents[deptName] = agent;
  }

  // Create Conversations for all dept
  for (const deptName of departmentNames) {
    const conversation = await prisma.conversation.create({
      data: {
        businessId: business.id,
        departmentId: departments[deptName].id,
        status: "open",
      },
    });

    await prisma.message.createMany({
      data: [
        {
          conversationId: conversation.id,
          sender: "customer",
          content: `Hello, I need help with ${deptName.toLowerCase()}`,
        },
        {
          conversationId: conversation.id,
          sender: "agent",
          content: `Hi! This is the ${deptName} team. How can I assist you?`,
        },
      ],
    });
  }

  console.log("Seed completed successfully!");
  console.log("Business ID:", business.id);
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
