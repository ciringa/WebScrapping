import { Prisma, Product, wSite } from "@prisma/client";
import { ProductRepository } from "../ProductsRepositorie";
import { randomInt, randomUUID } from "crypto";
import { sluggen } from "../../utils/sluggen";
import { string } from "zod";

export class MemoryProductRepository implements ProductRepository{
    private items:Product[] = []
    async create(data: Prisma.ProductUncheckedCreateInput): Promise<Product> {
        const _data:Product = {
            Id:randomInt(99999999999999999999999),
            Description:String(data.Description),
            Image:String(data.Image),
            Link:String(data.Link),
            Name:String(data.Name),
            Slug:sluggen(data.Slug),
            Worksite:String(data.Worksite) as wSite,
            WorkSiteLink:String(data.WorkSiteLink)
        }
        this.items.push(_data)
        return _data
    }
    async findById(Id: number): Promise<Product | null> {
        const x = this.items.find(item => item.Id == Id);
        return x?x:null;
    }
    async findBySlug(slug: string): Promise<Product | null> {
        const x = this.items.find(item => item.Slug == slug);
        return x?x:null;
    }
    async findByLink(Link: string): Promise<Product | null> {
        const x = this.items.find(item => item.Link == Link);
        return x?x:null;
    }
}