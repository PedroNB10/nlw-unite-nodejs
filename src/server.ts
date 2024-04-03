import fastify from "fastify";

import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";

import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { generateSlug } from "./utils/generate-slug";

const app = fastify();
// Add schema validator and serializer
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

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

// 20x => Sucesso
// 30x => Redirecionamento
// 40x => Erro do cliente (Erro em alguma informação enviada por QUEM está fazendo a chamada p/ API)
// 50x => Erro do servidor (Um erro que está acontecendo INDEPENDENTE do que está sendo enviado para o servidor)

app.withTypeProvider<ZodTypeProvider>().post(
  "/events",
  {
    schema: {
      body: z.object({
        title: z.string().min(4),
        details: z.string().nullable(),
        maximumAttendees: z.number().int().positive().nullable(),
      }),
      response: {
        // quando minha resposta tiver o status 201, ela deve ter o corpo com o eventId
        201: z.object({
          eventId: z.string().uuid(),
        }),
      },
    },
  },
  async (request, reply) => {
    console.log(request.body);

    //parse faz a validação dos dados
    const data = request.body;
    const slug = generateSlug(data.title);

    const eventWithSameSlug = await prisma.event.findUnique({
      where: {
        slug,
      },
    });

    // se o evento com o mesmo slug já existir, retorna um erro
    if (eventWithSameSlug) {
      throw new Error("Event with same slug already exists");
    }
    // o método create do prisma é responsável por criar um novo evento no banco de dados
    // é uma promise, por isso o await
    const event = await prisma.event.create({
      data: {
        title: data.title,
        details: data.details,
        maximumAttendees: data.maximumAttendees,
        slug,
      },
    });

    return reply.status(201).send({ eventId: event.id });
  }
);
