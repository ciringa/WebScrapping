import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { prisma } from "../../lib/db/prisma";


export async function GetInfoFromDbController(req:FastifyRequest,res:FastifyReply) {
    const {Query,Page} = z.object({
        Query:z.string(),
        Page:z.string()
    }).parse(req.params)
    try{
        const p = Number(Page)
        const search = await prisma.product.findMany({
            where:{
                Description:{
                    contains:Query
                }
            },
            skip:(p-1)*20,
            take:p*20
        })
    }catch(err){
        res.status(500).send(err)
    }
}