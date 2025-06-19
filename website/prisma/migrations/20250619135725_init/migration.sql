-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'CUSTOMER', 'USER');

-- CreateEnum
CREATE TYPE "AuditEvent" AS ENUM ('LOGIN', 'LOGOUT', 'CREATE_SUBSCRIPTION', 'PAYMENT_SUCCESS_PAGE', 'ADMIN_REGISTERED', 'USER_REGISTERED', 'SEND_USER_EMAIL_INVITE', 'ALLOW_SELF_FOR_LICENSE', 'DISALLOW_USER_FOR_LICENSE', 'DELETE_USER', 'ENABLE_DISABLE_LICENSE', 'ASSIGN_USER_TO_LICENSE', 'LICENSE_PASSWORD_CHANGED', 'UPDATE_CONTACT_DETAILS', 'UPDATE_PASSWORD', 'UPDATE_ACCOUNT_DETAILS', 'DOWNLOAD_FILE', 'CANCEL_SUBSCRIPTION', 'REVOKE_CANCEL_SUBSCRIPTION', 'PASSWORD_RESET_REQUEST', 'PASSWORD_RESET_SUCCESS');

-- CreateTable
CREATE TABLE "RegistrationLink" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "licenseId" BIGINT,
    "firstName" TEXT,
    "lastName" TEXT,
    "customerEmail" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RegistrationLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResetPasswordLink" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "sentCount" INTEGER NOT NULL DEFAULT 1,
    "lockedUntil" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bruteForceRefreshCount" INTEGER NOT NULL DEFAULT 50,

    CONSTRAINT "ResetPasswordLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Administrator" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "id_UserData" INTEGER NOT NULL,

    CONSTRAINT "Administrator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" SERIAL NOT NULL,
    "id_stripeCustomer" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "id_UserData" INTEGER NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "licenseIds" BIGINT[] DEFAULT ARRAY[]::BIGINT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "id_UserData" INTEGER NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserCustomer" (
    "id_User" INTEGER NOT NULL,
    "id_Customer" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserCustomer_pkey" PRIMARY KEY ("id_User","id_Customer")
);

-- CreateTable
CREATE TABLE "UserData" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL DEFAULT '',
    "lastName" TEXT NOT NULL DEFAULT '',
    "phone" TEXT NOT NULL DEFAULT '',
    "company" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL,
    "hashedPassword" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL DEFAULT '',
    "address" TEXT NOT NULL DEFAULT '',
    "street1" TEXT NOT NULL DEFAULT '',
    "street2" TEXT NOT NULL DEFAULT '',
    "street3" TEXT NOT NULL DEFAULT '',
    "city" TEXT NOT NULL DEFAULT '',
    "state" TEXT NOT NULL DEFAULT '',
    "postalCode" TEXT NOT NULL DEFAULT '',
    "country" TEXT NOT NULL DEFAULT '',
    "secret" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actorEmail" TEXT NOT NULL,
    "eventType" "AuditEvent" NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "description" TEXT,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLogChange" (
    "id" SERIAL NOT NULL,
    "fieldName" TEXT NOT NULL,
    "oldValue" TEXT,
    "newValue" TEXT,
    "id_AuditLog" INTEGER NOT NULL,

    CONSTRAINT "AuditLogChange_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLogMetadata" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "id_AuditLog" INTEGER NOT NULL,

    CONSTRAINT "AuditLogMetadata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CleanupLog" (
    "id" INTEGER NOT NULL,
    "lastRun" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CleanupLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RegistrationLink_token_key" ON "RegistrationLink"("token");

-- CreateIndex
CREATE UNIQUE INDEX "ResetPasswordLink_token_key" ON "ResetPasswordLink"("token");

-- CreateIndex
CREATE UNIQUE INDEX "ResetPasswordLink_email_key" ON "ResetPasswordLink"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Administrator_id_UserData_key" ON "Administrator"("id_UserData");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_id_stripeCustomer_key" ON "Customer"("id_stripeCustomer");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_id_UserData_key" ON "Customer"("id_UserData");

-- CreateIndex
CREATE UNIQUE INDEX "User_id_UserData_key" ON "User"("id_UserData");

-- CreateIndex
CREATE UNIQUE INDEX "UserData_email_key" ON "UserData"("email");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_actorEmail_idx" ON "AuditLog"("actorEmail");

-- CreateIndex
CREATE INDEX "AuditLog_eventType_idx" ON "AuditLog"("eventType");

-- CreateIndex
CREATE INDEX "AuditLogChange_id_AuditLog_idx" ON "AuditLogChange"("id_AuditLog");

-- CreateIndex
CREATE INDEX "AuditLogMetadata_id_AuditLog_idx" ON "AuditLogMetadata"("id_AuditLog");

-- AddForeignKey
ALTER TABLE "Administrator" ADD CONSTRAINT "Administrator_id_UserData_fkey" FOREIGN KEY ("id_UserData") REFERENCES "UserData"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_id_UserData_fkey" FOREIGN KEY ("id_UserData") REFERENCES "UserData"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_id_UserData_fkey" FOREIGN KEY ("id_UserData") REFERENCES "UserData"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCustomer" ADD CONSTRAINT "UserCustomer_id_User_fkey" FOREIGN KEY ("id_User") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCustomer" ADD CONSTRAINT "UserCustomer_id_Customer_fkey" FOREIGN KEY ("id_Customer") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLogChange" ADD CONSTRAINT "AuditLogChange_id_AuditLog_fkey" FOREIGN KEY ("id_AuditLog") REFERENCES "AuditLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLogMetadata" ADD CONSTRAINT "AuditLogMetadata_id_AuditLog_fkey" FOREIGN KEY ("id_AuditLog") REFERENCES "AuditLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;
