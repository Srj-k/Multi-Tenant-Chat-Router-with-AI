//create and export database connector

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;
