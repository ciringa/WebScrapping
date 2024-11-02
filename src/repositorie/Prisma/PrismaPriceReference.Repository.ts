import { Prisma, PriceReference } from "@prisma/client";
import { PriceReferenceRepository } from "../PriceRefRepositorie";
import { prisma } from "../../lib/db/prisma";

export class PrismaPriceRefRepository implements PriceReferenceRepository{
    async create(data: Prisma.PriceReferenceUncheckedCreateInput): Promise<PriceReference> {
        return await prisma.priceReference.create({
            data
        })
    }
    async findById(Id: string): Promise<PriceReference | null> {
        return  await prisma.priceReference.findUnique({where:{Id}})
    }
    async findByProduct(ProdId: number): Promise<PriceReference[]> {
        return await prisma.priceReference.findMany({where:{Prod_id:ProdId}})
    }
    async findMany(): Promise<PriceReference[]> {
        return await prisma.priceReference.findMany()
    }
}