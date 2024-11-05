import fastify from "fastify";
import { Router } from "../../http/router";
import { fastifyWebsocket } from "@fastify/websocket";

export const app = fastify();

app.register(fastifyWebsocket,{
    options:{
        maxPayload:1048576
    }
})


app.register(async function (fastify) {
    fastify.get('/*', { websocket: true }, (socket /* WebSocket */, req /* FastifyRequest */) => {
      socket.on('message', message => {
        // message.toString() === 'hi from client'
        socket.send('hi from wildcard route')
      })
    })
})

app.register(Router)

