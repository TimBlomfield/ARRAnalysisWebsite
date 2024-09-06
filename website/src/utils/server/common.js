import 'server-only';
import { Role } from '@prisma/client';
import db from '@/utils/db';


const TokenState = {
  Null:     -1, // null or undefined
  Empty:    -2, // '' i.e. empty string
  NotFound: -3, // Doesn't exist in the DB
  Expired:  -4, // Exists in the DB but is expired
  Valid:    1,
};

const checkToken = async token => {
  try {
    if (token == null) return { ts: TokenState.Null };
    if (token === '') return { ts: TokenState.Empty };

    const regLink = await db.registrationLink.findUnique({
      where: { token },
    });
    if (regLink == null) return { ts: TokenState.NotFound };

    if (regLink.expiresAt <= new Date()) {
      await db.registrationLink.delete({
        where: { id: regLink.id },
      });
      return { ts: TokenState.Expired };
    }

    const roleStr = regLink.role === Role.ADMIN
      ? 'Administrator'
      : regLink.role === Role.CUSTOMER
        ? 'Customer'
        : 'User';

    return { ts: TokenState.Valid, email: regLink.email, role: regLink.role, roleStr };
  } catch (error) {
    return { ts: TokenState.Null, error };
  }
};

export {
  TokenState,
  checkToken,
};
