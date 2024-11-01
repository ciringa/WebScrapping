import { PriceReference, Prisma } from "@prisma/client";
import { PriceReferenceRepository } from "../PriceRefRepositorie";
import { randomUUID } from "crypto";

export class MemoryPriceReferenceRepository implements PriceReferenceRepository{
    public item:PriceReference[] = [];
    async create(data: Prisma.PriceReferenceUncheckedCreateInput): Promise<PriceReference> {
        const _data:PriceReference = {
            Created_at:new Date(),
            Id:randomUUID(),
            PriceRef:Number(data.PriceRef),
            Prod_id:Number(data.Prod_id)
        }
        this.item.push(_data);
        return _data;
    }
    async findById(Id: string): Promise<PriceReference | null> {
        const x = this.item.find(item=> item.Id == Id);
        return x?x:null;
    }
    async findByProduct(ProdId: number): Promise<PriceReference[]> {
        const x = this.item.filter(item => item.Prod_id == ProdId);
        return x; 
    }
}