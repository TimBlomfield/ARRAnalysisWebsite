import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { AuditEvent } from '@prisma/client';
import { isAuthTokenValid } from '@/utils/server/common';
import { downloadFile } from '@/utils/server/s3';
import { createAuditLog } from '@/utils/server/audit';


const GET = async req => {
  const authToken = await getToken({ req });

  // User must be logged in
  if (authToken?.email == null || !isAuthTokenValid(authToken))
    return NextResponse.json({ message: 'Not authorized!' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const file = searchParams.get('file');
  const isRscRequest = searchParams.has('_rsc'); // Check for RSC request

  if (!file)
    return NextResponse.json({ error: 'No file specified for download!' }, { status: 400 });

  try {
    const fileKey = `${process.env.CLOUDCUBE_TOP_FOLDER}${process.env.CLOUDCUBE_INSTALLS_FOLDER}${atob(file)}`;

    const { bodyContents, contentType } = await downloadFile(fileKey);

    // Add the version to the filename
    const arr = fileKey.split('/');
    const arrF = arr[arr.length - 1].split('.');
    const fileName = `ARR Analysis Excel Add-in (${arrF[0]}) [version ${arr[arr.length - 3]}].${arrF[1]}`;

    // Only log if not an RSC request (prevents duplicate DOWNLOAD_FILE logs)
    if (!isRscRequest) {
      await createAuditLog({
        type: AuditEvent.DOWNLOAD_FILE,
        actorEmail: authToken.email,
        desc: fileName,
      }, req);
    }

    return new NextResponse(bodyContents, {
      headers: {
        'Content-Type': contentType || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
      status: 200,
    });
  } catch (error) {
    console.error('Error downloading file:', error);
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }
};


export {
  GET,
};
