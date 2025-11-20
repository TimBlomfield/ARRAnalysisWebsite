-- CreateEnum
CREATE TYPE "TrialStatus" AS ENUM ('PENDING_VERIFICATION', 'EMAIL_VERIFIED', 'ACTIVATED');

-- CreateTable
CREATE TABLE "TrialRequest" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "status" "TrialStatus" NOT NULL DEFAULT 'PENDING_VERIFICATION',
    "userAgent" TEXT NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "downloads" INTEGER NOT NULL DEFAULT 0,
    "firstName" TEXT,
    "lastName" TEXT,
    "company" TEXT,
    "phone" TEXT,
    "jobTitle" TEXT,
    "country" TEXT,
    "licenseId" BIGINT,
    "licensePassword" TEXT,

    CONSTRAINT "TrialRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrialRequestLimitIp" (
    "ipAddress" TEXT NOT NULL,
    "sentCount" INTEGER NOT NULL DEFAULT 1,
    "lockedUntil" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrialRequestLimitIp_pkey" PRIMARY KEY ("ipAddress")
);

-- CreateIndex
CREATE UNIQUE INDEX "TrialRequest_token_key" ON "TrialRequest"("token");
