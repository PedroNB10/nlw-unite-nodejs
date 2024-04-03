import fastify from "fastify";

import { z } from "zod";
import { PrismaClient } from "@prisma/client";

const app = fastify();

const prisma = new PrismaClient({
  log: ["query"], // isso serve para mostrar no terminal as querys que estão sendo executadas
});

app.get("/", (request, reply) => {
  return { hello: "world" };
});

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log("Server is running on port 3333");
  });

app.post("/events", async (request, reply) => {
  console.log(request.body);

  // a constante createEventSchema é um objeto que define as regras de validação dos dados
  const createEventSchema = z.object({
    title: z.string().min(4),
    details: z.string().nullable(),
    maximumAttendees: z.number().int().positive().nullable(),
  });

  //parse faz a validação dos dados
  const data = createEventSchema.parse(request.body);

  // o método create do prisma é responsável por criar um novo evento no banco de dados
  // é uma promise, por isso o await
  const event = await prisma.event.create({
    data: {
      title: data.title,
      details: data.details,
      maximumAttendees: data.maximumAttendees,
      slug: new Date().toISOString(),
    },
  });

  return reply.status(201).send({ eventId: event.id });
});
