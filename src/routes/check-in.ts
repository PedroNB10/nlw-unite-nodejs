import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../lib/prisma";

export async function checkIn(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/attendees/:attendeeId/check-in",
    {
      schema: {
        params: z.object({
          attendeeId: z.coerce.number().int(),
        }),
        response: {},
      },
    },
    async (request, reply) => {
      const { attendeeId } = request.params;

      const attendeeCheckIn = await prisma.checkin.findUnique({
        where: {
          attendeeId,
        },
      });

      if (attendeeCheckIn !== null) {
        throw new Error("Attendee already checked in");
      }

      await prisma.checkin.create({
        data: {
          attendeeId,
        },
      });

      return reply.status(201).send();
    }
  );
}