import { PriceReference, Prisma, Product } from "@prisma/client";

export interface PriceReferenceRepository {
    create(data:Prisma.ProductUncheckedCreateInput):Promise<Product>
    findBySlug(slug:string):Promise<Product>
    findById(Id:string):Promise<Product>
    findByLink(Link:string):Promise<Product>
}