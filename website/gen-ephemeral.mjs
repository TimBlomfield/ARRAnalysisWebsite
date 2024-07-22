// Test file to generate ephemeral link record in the db
// Run from the terminal: node ./gen-ephemeral.mjs

import { randomBytes } from 'node:crypto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


const createRegistrationLink = async () => {
  try {
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 1000*60*60*24);
    await prisma.adminRegistrationLink.create({
      data: {
        token,
        email: 'kire@example.com',
        expiresAt,
      },
    });
  } catch (error) {
    console.log(error);
  }
}

createRegistrationLink();
console.log('done');
