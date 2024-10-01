-- CreateTable
CREATE TABLE "Customer" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClothingType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClothingType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SizeAttribute" (
    "id" SERIAL NOT NULL,
    "clothingTypeId" INTEGER NOT NULL,
    "attributeName" TEXT NOT NULL,
    "measurementUnit" TEXT NOT NULL DEFAULT 'cm',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SizeAttribute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerSize" (
    "id" SERIAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "clothingTypeId" INTEGER NOT NULL,
    "sizeAttributeId" INTEGER NOT NULL,
    "sizeValue" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CustomerSize_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Customer_email_key" ON "Customer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_username_key" ON "Admin"("username");

-- AddForeignKey
ALTER TABLE "SizeAttribute" ADD CONSTRAINT "SizeAttribute_clothingTypeId_fkey" FOREIGN KEY ("clothingTypeId") REFERENCES "ClothingType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerSize" ADD CONSTRAINT "CustomerSize_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerSize" ADD CONSTRAINT "CustomerSize_clothingTypeId_fkey" FOREIGN KEY ("clothingTypeId") REFERENCES "ClothingType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerSize" ADD CONSTRAINT "CustomerSize_sizeAttributeId_fkey" FOREIGN KEY ("sizeAttributeId") REFERENCES "SizeAttribute"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
