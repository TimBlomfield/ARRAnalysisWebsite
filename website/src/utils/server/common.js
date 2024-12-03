import 'server-only';
import { Role } from '@prisma/client';
import db from '@/utils/server/db';


const RegTokenState = {
  Null:     -1, // null or undefined
  Empty:    -2, // '' i.e. empty string
  NotFound: -3, // Doesn't exist in the DB
  Expired:  -4, // Exists in the DB but is expired
  Valid:    1,
};

// Check the registration token (passed as a URL parameter)
const checkRegToken = async token => {
  try {
    if (token == null) return { ts: RegTokenState.Null };
    if (token === '') return { ts: RegTokenState.Empty };

    const regLink = await db.registrationLink.findUnique({
      where: { token },
    });
    if (regLink == null) return { ts: RegTokenState.NotFound };

    if (regLink.expiresAt <= new Date()) {
      await db.registrationLink.delete({
        where: { id: regLink.id },
      });
      return { ts: RegTokenState.Expired };
    }

    const retVal = { ts: RegTokenState.Valid, email: regLink.email, role: regLink.role };

    // Add more fields for Role.USER
    if (regLink.role === Role.USER) {
      retVal.userData = {
        licenseId: regLink.licenseId,
        firstName: regLink.firstName,
        lastName: regLink.lastName,
        customerEmail: regLink.customerEmail,
      };

      // Check for existing UserData
      const existingUserData = await db.userData.findUnique({
        where: { email: regLink.email },
      });
      retVal.userExists = existingUserData != null;
    }

    return retVal;
  } catch (error) {
    return { ts: RegTokenState.Null, error };
  }
};

const isAuthTokenValid = authToken => (authToken != null && authToken.email != null && (new Date(authToken.exp * 1000) > new Date()));

// Get AdminID, CustomerID and UserID for email (ACU stands for Admin Customer User)
const getACU_Ids = async email => {
  const userData = await db.userData.findUnique({
    where: { email },
    select: {
      id: true, // Only select ID to minimize data transfer
      admin: {
        select: { id: true },
      },
      customer: {
        select: { id: true },
      },
      user: {
        select: { id: true },
      },
    },
  });

  if (userData == null)
    return null;

  return {
    adminId: userData.admin?.id,
    customerId: userData.customer?.id,
    userId: userData.user?.id,
  };
};

const debugWait = ms => new Promise(resolve => setTimeout(resolve, ms));

export {
  RegTokenState,
  checkRegToken,
  isAuthTokenValid,
  getACU_Ids,
  debugWait,
};
