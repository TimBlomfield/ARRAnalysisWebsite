import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getToken } from 'next-auth/jwt';
import { S3Client, CopyObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { isAuthTokenValid } from '@/utils/server/common';


const POST = async req => {
  const authToken = await getToken({ req });
  const { file, destination } = await req.json();

  // User must be logged in, and must be an admin for this action
  if (authToken?.email == null || authToken?.userData?.adminId == null || !isAuthTokenValid(authToken))
    return NextResponse.json({ message: 'Not authorized!' }, { status: 401 });

  try {
    const bucket = process.env.CLOUDCUBE_BUCKET;
    const client = new S3Client({
      region: 'us-east-1',
      credentials: {
        accessKeyId: process.env.CLOUDCUBE_ACCESS_KEY_ID,
        secretAccessKey: process.env.CLOUDCUBE_SECRET_ACCESS_KEY,
      },
    });

    // Step 1: Copy to new location
    const copyParams = {
      Bucket: bucket,
      CopySource: `${bucket}/${encodeURIComponent(file.name).replace(/%2F/g, '/')}`,
      Key: destination,
    };
    const cmdCopy = new CopyObjectCommand(copyParams);
    await client.send(cmdCopy);

    // If copy succeeds, proceed to delete original
    const deleteParams = {
      Bucket: bucket,
      Key: file.name,
    };
    const cmdDelete = new DeleteObjectCommand(deleteParams);
    await client.send(cmdDelete);

    console.info(`Moved "${file.name}" to "${destination}"`);
  } catch (error) {
    console.error('Move File - an error has occurred: ', error);
    return NextResponse.json({ message: error.message }, { status: 404 });
  }

  revalidatePath('/admin/upload/overview');
  revalidatePath('/admin/upload/versions');

  return NextResponse.json({ message: 'File moved successfully!' }, { status: 200 });
};


export {
  POST,
};
