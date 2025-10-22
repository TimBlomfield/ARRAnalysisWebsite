import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getToken } from 'next-auth/jwt';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { isAuthTokenValid } from '@/utils/server/common';


const POST = async req => {
  const authToken = await getToken({ req });
  const { version, versionObj, files } = await req.json();

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

    for (const obj of versionObj) {
      const deleteParams = {
        Bucket: bucket,
        Key: files[obj.idx].name,
      };

      const cmdDelete = new DeleteObjectCommand(deleteParams);
      await client.send(cmdDelete);

      console.info(`Deleted file "${files[obj.idx].name}"`);
    }

    console.info(`Deleted version "${version}"`);
  } catch (error) {
    console.error('Delete Version - an error has occurred: ', error);
    return NextResponse.json({ message: error.message }, { status: 404 });
  }

  revalidatePath('/admin/upload/overview');
  revalidatePath('/admin/upload/versions');

  return NextResponse.json({ message: 'Version deleted successfully!' }, { status: 200 });
};


export {
  POST,
};
