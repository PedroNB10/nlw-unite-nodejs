// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";
var prisma = new PrismaClient({
  log: ["query"]
  // isso serve para mostrar no terminal as querys que estão sendo executadas
});

export {
  prisma
};
