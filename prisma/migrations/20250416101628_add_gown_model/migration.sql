-- CreateTable
CREATE TABLE "Gown" (
    "id" TEXT NOT NULL,
    "codename" TEXT NOT NULL,
    "priceLow" DOUBLE PRECISION NOT NULL,
    "standardPrice" DOUBLE PRECISION NOT NULL,
    "color" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Gown_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GownType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "GownType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GownSize" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "GownSize_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_GownToGownType" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_GownToGownType_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_GownToGownSize" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_GownToGownSize_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "GownType_name_key" ON "GownType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "GownSize_label_key" ON "GownSize"("label");

-- CreateIndex
CREATE INDEX "_GownToGownType_B_index" ON "_GownToGownType"("B");

-- CreateIndex
CREATE INDEX "_GownToGownSize_B_index" ON "_GownToGownSize"("B");

-- AddForeignKey
ALTER TABLE "_GownToGownType" ADD CONSTRAINT "_GownToGownType_A_fkey" FOREIGN KEY ("A") REFERENCES "Gown"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GownToGownType" ADD CONSTRAINT "_GownToGownType_B_fkey" FOREIGN KEY ("B") REFERENCES "GownType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GownToGownSize" ADD CONSTRAINT "_GownToGownSize_A_fkey" FOREIGN KEY ("A") REFERENCES "Gown"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GownToGownSize" ADD CONSTRAINT "_GownToGownSize_B_fkey" FOREIGN KEY ("B") REFERENCES "GownSize"("id") ON DELETE CASCADE ON UPDATE CASCADE;
