-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rental" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "pickupDate" TIMESTAMP(3) NOT NULL,
    "returnDate" TIMESTAMP(3) NOT NULL,
    "gownDesc" TEXT NOT NULL,
    "forRepair" BOOLEAN NOT NULL DEFAULT false,
    "downPayment" DECIMAL(65,30) NOT NULL,
    "totalAmount" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Rental_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Appointment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_date_time_key" ON "Appointment"("date", "time");

-- AddForeignKey
ALTER TABLE "Rental" ADD CONSTRAINT "Rental_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
