import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { isAuthTokenValid } from '@/utils/server/common';


// Check if an email exists in the system
const GET = async req => {
  const authToken = await getToken({ req });

  // User must be logged in
  if (authToken?.email == null || !isAuthTokenValid(authToken))
    return NextResponse.json({ message: 'Not authorized!' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const { file } = searchParams.get('file');

  if (!file) {
    return NextResponse.json({ error: 'No file specified for download!' }, { status: 400 });
  }

  try {
    const fileKey = JSON.parse(atob(file));

    const command = new GetObjectCommand({  // TODO: use downloadFile() here
      Bucket: process.env.CLOUDCUBE_BUCKET,
      Key: fileKey,
    });

    const response = await client.send(command);

    // Convert the response body to a Buffer
    const bodyContents = await response.Body.transformToByteArray();

    return new NextResponse(bodyContents, {
      headers: {
        'Content-Type': response.ContentType || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${fileKey.split('/').pop()}"`,
      },
      status: 200,
    });
  } catch (error) {
    console.error('Error downloading file:', error);
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }
  /*
  const { tier, version, fileName } = await req.json();
  const fileKey = `${process.env.CLOUDCUBE_TOP_FOLDER}installers/${tier}/${version}/${fileName}`;
  return createFileDownloadResponse(fileKey);*/
};


export {
  GET,
};
