import 'server-only';
import { AuditEvent } from '@prisma/client';
import db from '@/utils/server/db';


const createAuditLog = async (evt, req) => {
  let ipAddress = null, userAgent = null;
  if (req != null) {
    if (req.headers?.get != null && (typeof req.headers.get === 'function')) {
      ipAddress = req.headers.get('x-forwarded-for') || req.ip;
      userAgent = req.headers.get('user-agent');
    } else {
      ipAddress = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || req.connection?.remoteAddress;
      userAgent = req.headers['user-agent'];
    }
  }

  const cond = (d, o, prop) => {
    if (o[prop])
      d.push({ key: prop, value: o[prop].toString() });
  };

  switch (evt.type) {
    case AuditEvent.LOGIN:
      {
        const desc = {
          isAdmin: evt.admin != null,
          isCustomer: evt.customer != null,
          isUser: evt.user != null,
        };
        await db.auditLog.create({
          data: {
            actorEmail: evt.email,
            eventType: evt.type,
            ipAddress,
            userAgent,
            description: JSON.stringify(desc),
          },
        });
      }
      break;

    case AuditEvent.LOGOUT:
      {
        const desc = {
          isAdmin: evt.isAdmin,
          isCustomer: evt.isCustomer,
          isUser: evt.isUser,
        };
        await db.auditLog.create({
          data: {
            actorEmail: evt.email,
            eventType: evt.type,
            ipAddress,
            userAgent,
            description: JSON.stringify(desc),
          },
        });
      }
      break;

    case AuditEvent.CREATE_SUBSCRIPTION:
      {
        const data = [
          { key: 'firstName', value: evt.firstName },
          { key: 'lastName', value: evt.lastName },
          { key: 'hashedPassword', value: evt.hashedPassword },
          { key: 'secret', value: evt.secret },
          { key: 'quantity', value: evt.quantity.toString() },
          { key: 'tier', value: evt.tier.toString() },
          { key: 'period', value: evt.period },
        ];
        if (evt.company != null)
          data.push({ key: 'company', value: evt.company });
        await db.auditLog.create({
          data: {
            actorEmail: evt.email,
            eventType: evt.type,
            ipAddress,
            userAgent,
            metadata: {
              createMany: {
                data,
              },
            },
          },
        });
      }
      break;

    case AuditEvent.PAYMENT_SUCCESS_PAGE:
      {
        const meta = await db.auditLogMetadata.findFirst({
          where: { value: evt.secret },
          include: {
            auditLog: {
              select: {
                id: true,
                actorEmail: true,
              },
            },
          },
        });
        await db.auditLog.create({
          data: {
            actorEmail: meta != null ? meta.auditLog.actorEmail : 'Error',
            eventType: evt.type,
            metadata: {
              createMany: {
                data: [
                  {
                    key: 'CreateSubscription_AuditLogId',
                    value: meta != null ? meta.auditLog.id.toString() : 'Error',
                  },
                  {
                    key: 'stripeCustomerId',
                    value: evt.stripeCustomerId,
                  },
                ],
              },
            },
          },
        });
      }
      break;

    case AuditEvent.ADMIN_REGISTERED:
      {
        await db.auditLog.create({
          data: {
            actorEmail: evt.email,
            eventType: evt.type,
            ipAddress,
            userAgent,
          },
        });
      }
      break;

    case AuditEvent.SEND_USER_EMAIL_INVITE:
      {
        const data = [
          { key: 'licenseId', value: evt.licenseId.toString() },
          { key: 'userEmail', value: evt.email },
          { key: 'registrationUrl', value: evt.regUrl },
          { key: 'htmlMailContents', value: evt.html },
        ];
        if (evt.firstName)
          data.push({ key: 'firstName', value: evt.firstName });
        if (evt.lastName)
          data.push({ key: 'lastName', value: evt.lastName });
        await db.auditLog.create({
          data: {
            eventType: evt.type,
            actorEmail: evt.actor,
            ipAddress,
            userAgent,
            description: evt.bExisting ? 'Exists' : 'NewUser',
            metadata: {
              createMany: {
                data,
              },
            },
          },
        });
      }
      break;

    case AuditEvent.USER_REGISTERED:
      {
        const data = [
          { key: 'hashedPassword', value: evt.data.hashedPassword },
          { key: 'licenseId', value: evt.licenseId.toString() },
          { key: 'stripeCustomerId', value: evt.stripeCustomerId },
          { key: 'customerEmail', value: evt.customerEmail },
        ];
        if (evt.data.firstName)
          data.push({ key: 'firstName', value: evt.data.firstName });
        if (evt.data.lastName)
          data.push({ key: 'lastName', value: evt.data.lastName });
        await db.auditLog.create({
          data: {
            eventType: evt.type,
            actorEmail: evt.data.email,
            ipAddress,
            userAgent,
            metadata: {
              createMany: {
                data,
              },
            },
          },
        });
      }
      break;

    case AuditEvent.ALLOW_SELF_FOR_LICENSE:
      {
        await db.auditLog.create({
          data: {
            eventType: evt.type,
            actorEmail: evt.email,
            ipAddress,
            userAgent,
            description: evt.licenseId.toString(),
          },
        });
      }
      break;

    case AuditEvent.DISALLOW_USER_FOR_LICENSE:
      {
        const data = [
          { key: 'wasUsing', value: evt.using.toString() },
          { key: 'licenseId', value: evt.licenseId.toString() },
          { key: 'userEmail', value: evt.email },
        ];
        await db.auditLog.create({
          data: {
            eventType: evt.type,
            actorEmail: evt.actorEmail,
            ipAddress,
            userAgent,
            metadata: {
              createMany: {
                data,
              },
            },
          },
        });
      }
      break;

    case AuditEvent.DELETE_USER:
      {
        const usrData = evt.user.data;
        const data = [
          { key: 'userId', value: usrData.id.toString() },
          { key: 'userEmail', value: usrData.email },
        ];
        cond(data, usrData, 'firstName');
        cond(data, usrData, 'lastName');
        cond(data, usrData, 'phone');
        cond(data, usrData, 'company');
        cond(data, usrData, 'hashedPassword');
        cond(data, usrData, 'jobTitle');
        cond(data, usrData, 'address');
        cond(data, usrData, 'street1');
        cond(data, usrData, 'street2');
        cond(data, usrData, 'street3');
        cond(data, usrData, 'city');
        cond(data, usrData, 'state');
        cond(data, usrData, 'postalCode');
        if (usrData.customer != null) {
          data.push({ key: 'customerId', value: usrData.customer.id.toString() });
          data.push({ key: 'stripeCustomerId', value: usrData.customer.id_stripeCustomer.toString() });
        }
        await db.auditLog.create({
          data: {
            eventType: evt.type,
            actorEmail: evt.actorEmail,
            ipAddress,
            userAgent,
            metadata: {
              createMany: {
                data,
              },
            },
          },
        });
      }
      break;

    case AuditEvent.ENABLE_DISABLE_LICENSE:
      {
        await db.auditLog.create({
          data: {
            eventType: evt.type,
            actorEmail: evt.actorEmail,
            ipAddress,
            userAgent,
            description: evt.enable ? 'Enable' : 'Disable',
            metadata: {
              create: {
                key: 'licenseId',
                value: evt.licenseId.toString(),
              },
            },
          },
        });
      }
      break;

    case AuditEvent.ASSIGN_USER_TO_LICENSE:
      {
        await db.auditLog.create({
          data: {
            eventType: evt.type,
            actorEmail: evt.actorEmail,
            ipAddress,
            userAgent,
            description: evt.licenseId.toString(),
          },
        });
      }
      break;

    case AuditEvent.LICENSE_PASSWORD_CHANGED:
      {
        await db.auditLog.create({
          data: {
            eventType: evt.type,
            actorEmail: evt.actorEmail, // Who did it
            ipAddress,
            userAgent,
            description: evt.email, // User whose password was changed
          },
        });
      }
      break;
  }
};


export {
  createAuditLog,
};
