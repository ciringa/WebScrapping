import { app } from "./lib/fastify/app";



app.listen({
    port:2333,
    host:"127.0.0.1"
},(err,path)=>{
    console.log(err||path);
})