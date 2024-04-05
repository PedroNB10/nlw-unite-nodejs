import fastify from "fastify";

import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastifyCors from "@fastify/cors";

import {
  serializerCompiler,
  validatorCompiler,
  jsonSchemaTransform,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import { createEvent } from "./routes/create-event";
import { registerForEvent } from "./routes/register-for-event";
import { getEvent } from "./routes/get-event";
import { getAttendeeBadge } from "./routes/get-attendee-badge";
import { checkIn } from "./routes/check-in";
import { getEventAttendees } from "./routes/get-event-attendees";
import { errorHandler } from "./error-handler";

const app = fastify().withTypeProvider<ZodTypeProvider>();

//
app.register(fastifyCors, {
  origin: "*", // habilita o CORS para qualquer origem, o certo é colocar o endereço do front-end
});

// gerando documentação
app.register(fastifySwagger, {
  swagger: {
    consumes: ["application/json"],
    produces: ["application/json"],
    info: {
      title: "pass.in API",
      description:
        "Especificações da API para o back-end da aplicação pass.in construída durante o NLW Unite da Rocketseat.",
      version: "1.0.0",
    },
  },
  transform: jsonSchemaTransform,
});

// para acessar o docs é só colocar http://localhost:3333/docs
app.register(fastifySwaggerUi, {
  routePrefix: "/docs",
});
// Add schema validator and serializer
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createEvent);
app.register(registerForEvent);
app.register(getEvent);
app.register(getAttendeeBadge);
app.register(checkIn);
app.register(getEventAttendees);

app.setErrorHandler(errorHandler);

app
  .listen({
    port: 3333,
    host: "0.0.0.0",
  })
  .then(() => {
    console.log("Server is running on port 3333");
  });

// 20x => Sucesso
// 30x => Redirecionamento
// 40x => Erro do cliente (Erro em alguma informação enviada por QUEM está fazendo a chamada p/ API)
// 50x => Erro do servidor (Um erro que está acontecendo INDEPENDENTE do que está sendo enviado para o servidor)
