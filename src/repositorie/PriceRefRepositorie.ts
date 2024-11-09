import { PriceReference, Prisma } from "@prisma/client";

export interface PriceReferenceRepository {
    create(data:Prisma.PriceReferenceUncheckedCreateInput):Promise<PriceReference>
    findById(Id:string):Promise<PriceReference | null>
    findByProduct(ProdId:number):Promise<PriceReference[]>
    findMany():Promise<PriceReference[]>
}