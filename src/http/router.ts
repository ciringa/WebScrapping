import { FastifyInstance, FastifyRequest } from "fastify";
import { ScrapMercadoLivreController } from "./controllers/ScrapMercadoLivreController";
import { GetInfoFromDbController } from "./controllers/getInfoFromDb";
import { a } from "vitest/dist/chunks/suite.B2jumIFP";

export async function Router(app:FastifyInstance) {
    app.route({
        handler:ScrapMercadoLivreController,url:"/ml/scrap/:Query/:Page",method:"POST"
    })

    app.get('/ws', { websocket: true }, (socket, req) => {
        socket.on('message', message => {
          //message.toString() === 'hi from client'
          socket.send('hi from wildcard route')
        })
    })

}