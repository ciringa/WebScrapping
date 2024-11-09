-- CreateEnum
CREATE TYPE "wSite" AS ENUM ('MercadoLivre');

-- CreateTable
CREATE TABLE "Product" (
    "Id" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,
    "Slug" TEXT NOT NULL,
    "Link" TEXT NOT NULL,
    "Image" TEXT NOT NULL,
    "Description" TEXT NOT NULL,
    "Worksite" "wSite" NOT NULL DEFAULT 'MercadoLivre',
    "WorkSiteLink" TEXT NOT NULL DEFAULT 'https://www.mercadolivre.com.br',

    CONSTRAINT "Product_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "PriceReference" (
    "Id" TEXT NOT NULL,
    "PriceRef" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "Created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Prod_id" INTEGER NOT NULL,

    CONSTRAINT "PriceReference_pkey" PRIMARY KEY ("Id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_Slug_key" ON "Product"("Slug");

-- CreateIndex
CREATE UNIQUE INDEX "Product_Link_key" ON "Product"("Link");

-- AddForeignKey
ALTER TABLE "PriceReference" ADD CONSTRAINT "PriceReference_Prod_id_fkey" FOREIGN KEY ("Prod_id") REFERENCES "Product"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;
