import fastify from "fastify";
import { Router } from "../../http/router";

export const app = fastify();


app.register(Router)