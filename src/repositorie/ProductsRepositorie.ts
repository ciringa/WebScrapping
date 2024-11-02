import { PriceReference, Prisma, Product } from "@prisma/client";

export interface ProductRepository {
    create(data:Prisma.ProductUncheckedCreateInput):Promise<Product>
    findBySlug(slug:string):Promise<Product | null>
    findById(Id:number):Promise<Product | null>
    findByLink(Link:string):Promise<Product | null>
}