import {
  registerForEvent
} from "./chunk-AAYJQNIV.mjs";
import {
  errorHandler
} from "./chunk-BVFK3ORA.mjs";
import {
  checkIn
} from "./chunk-VALC5D27.mjs";
import {
  createEvent
} from "./chunk-I3T7KVHV.mjs";
import "./chunk-KDMJHR3Z.mjs";
import {
  getAttendeeBadge
} from "./chunk-A2RGV4JT.mjs";
import {
  getEventAttendees
} from "./chunk-S234O7VR.mjs";
import {
  getEvent
} from "./chunk-YZOO3ZV6.mjs";
import "./chunk-JRO4E4TH.mjs";
import "./chunk-KXPAQFIE.mjs";

// src/server.ts
import fastify from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastifyCors from "@fastify/cors";
import {
  serializerCompiler,
  validatorCompiler,
  jsonSchemaTransform
} from "fastify-type-provider-zod";
var app = fastify().withTypeProvider();
app.register(fastifyCors, {
  origin: "*"
  // habilita o CORS para qualquer origem, o certo é colocar o endereço do front-end
});
app.register(fastifySwagger, {
  swagger: {
    consumes: ["application/json"],
    produces: ["application/json"],
    info: {
      title: "pass.in API",
      description: "Especifica\xE7\xF5es da API para o back-end da aplica\xE7\xE3o pass.in constru\xEDda durante o NLW Unite da Rocketseat.",
      version: "1.0.0"
    }
  },
  transform: jsonSchemaTransform
});
app.register(fastifySwaggerUi, {
  routePrefix: "/docs"
});
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
app.register(createEvent);
app.register(registerForEvent);
app.register(getEvent);
app.register(getAttendeeBadge);
app.register(checkIn);
app.register(getEventAttendees);
app.setErrorHandler(errorHandler);
app.listen({
  port: 3333,
  host: "0.0.0.0"
}).then(() => {
  console.log("Server is running on port 3333");
});
