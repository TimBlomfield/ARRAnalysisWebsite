import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { isAuthTokenValid } from '@/utils/server/common';
import { downloadFile } from '@/utils/server/s3';


const GET = async req => {
  const authToken = await getToken({ req });

  // User must be logged in, and must be an admin for this action
  if (authToken?.email == null || authToken?.userData?.adminId == null || !isAuthTokenValid(authToken))
    return NextResponse.json({ message: 'Not authorized!' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const fileKey = searchParams.get('fileKey');

  if (!fileKey)
    return NextResponse.json({ error: 'No file specified for download!' }, { status: 400 });

  try {
    const { bodyContents, contentType } = await downloadFile(fileKey);

    // Add the version to the filename
    const arr = fileKey.split('/');
    const fileName = arr[arr.length - 1];

    return new NextResponse(bodyContents, {
      headers: {
        'Content-Type': contentType || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(fileName)}"`,
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
