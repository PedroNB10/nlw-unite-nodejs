import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { generateSlug } from "../utils/generate-slug";
import { prisma } from "../lib/prisma";
import { FastifyInstance } from "fastify";

export async function createEvent(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/events",
    {
      schema: {
        summary: "Create an event",
        tags: ["events"],
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
}
