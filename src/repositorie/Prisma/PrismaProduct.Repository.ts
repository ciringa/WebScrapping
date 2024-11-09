import { Prisma, Product } from "@prisma/client";
import { ProductRepository } from "../ProductsRepositorie";
import { prisma } from "../../lib/db/prisma";

export class PrismaProductRepository implements ProductRepository{
    async create(data: Prisma.ProductUncheckedCreateInput): Promise<Product> {
        return await prisma.product.create({
            data
        })
    }
    async findById(Id: number): Promise<Product | null> {
        return await prisma.product.findUnique({
            where:{
                Id
            }
        })
    }
    async findByLink(Link: string): Promise<Product | null> {
        return await prisma.product.findUnique({
            where:{
                Link
            }
        })
    }
    async findBySlug(slug: string): Promise<Product | null> {
        return await prisma.product.findUnique({
            where:{
                Slug:slug
            }
        })
    }
    async findMany(): Promise<Product[]> {
        return await prisma.product.findMany()   
    }
}