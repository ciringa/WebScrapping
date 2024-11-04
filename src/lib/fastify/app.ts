import fastify from "fastify";
import { Router } from "../../http/router";
import { fastifyWebsocket } from "@fastify/websocket";

export const app = fastify();

app.register(fastifyWebsocket,{
    options:{
        maxPayload:1048576
    }
})
app.register(Router)

