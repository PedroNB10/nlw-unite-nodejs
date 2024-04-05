import { prisma } from "../src/lib/prisma";

async function seed() {
  await prisma.event.create({
    data: {
      id: "c835c105-ddb0-41c3-9cf4-89f23fd658cc",
      title: "Unite Summit",
      slug: "unite-summit",
      details: "Um evento p/ devs apaixonados por desenvolver software ",
      maximumAttendees: 140,
    },
  });
}

seed().then(() => {
  console.log("Seed executado com sucesso");
  prisma.$disconnect(); // desconexao do banco de dados
});
