import { PrismaClient } from '@prisma/client';

const prisma = globalThis.prismaGlobal ?? (new PrismaClient());

// Due to hot-reloading, multiple prisma clients may be created. To avoid that, store the prisma client into globalThis.
// Only when developing locally.
if (process.env.K_ENVIRONMENT === 'Local') globalThis.prismaGlobal = prisma;

export default prisma;
