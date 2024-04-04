import fastify from "fastify";

import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { createEvent } from "./routes/create-event";

const app = fastify();
// Add schema validator and serializer
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createEvent);

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
