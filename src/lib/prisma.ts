import { PrismaClient } from "@prisma/client";

//conexão com banco de dados
export const prisma = new PrismaClient({
  log: ["query"], // isso serve para mostrar no terminal as querys que estão sendo executadas
});
