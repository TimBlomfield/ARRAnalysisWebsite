import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getToken } from 'next-auth/jwt';
import { S3Client, CopyObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { isAuthTokenValid } from '@/utils/server/common';


const POST = async req => {
  const authToken = await getToken({ req });
  const { targetVersion, arrOld, files } = await req.json();

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

    for (const oldOne of arrOld) {
      const destination = `${process.env.CLOUDCUBE_TOP_FOLDER}${process.env.CLOUDCUBE_INSTALLS_FOLDER}${targetVersion}/${oldOne.tier}/${oldOne.fileName}`;

      // First try to copy to new location
      const copyParams = {
        Bucket: bucket,
        CopySource: `${bucket}/${encodeURIComponent(files[oldOne.idx].name).replace(/%2F/g, '/')}`,
        Key: destination,
      };

      const cmdCopy = new CopyObjectCommand(copyParams);
      await client.send(cmdCopy);

      // If copy succeeds, proceed to delete original
      const deleteParams = {
        Bucket: bucket,
        Key: files[oldOne.idx].name,
      };
      const cmdDelete = new DeleteObjectCommand(deleteParams);
      await client.send(cmdDelete);

      console.info(`Moved "${files[oldOne.idx].name}" to "${destination}"`);
    }
  } catch (error) {
    console.error('Change Version Number - an error has occurred: ', error);
    return NextResponse.json({ message: error.message }, { status: 404 });
  }

  revalidatePath('/admin/upload/overview');
  revalidatePath('/admin/upload/versions');

  return NextResponse.json({ message: 'Version re-numbered successfully!' }, { status: 200 });
};


export {
  POST,
};
