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
              create: {
                key: 'CreateSubscription_AuditLogId',
                value: meta != null ? meta.auditLog.id.toString() : 'Error',
              },
            },
          },
        });
      }
      break;
  }
};


export {
  createAuditLog,
};
