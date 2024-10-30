import { FastifyInstance } from "fastify";
import { ScrapMercadoLivreController } from "./controllers/ScrapMercadoLivreController";

export async function Router(app:FastifyInstance) {
    app.route({
        handler:ScrapMercadoLivreController,url:"/ml/scrap/:Query/:Page",method:"GET"
    })
    
}