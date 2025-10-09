import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getToken } from 'next-auth/jwt';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { isAuthTokenValid } from '@/utils/server/common';


const POST = async req => {
  const authToken = await getToken({ req });

  // User must be logged in, and must be an admin for this action
  if (authToken?.email == null || authToken?.userData?.adminId == null || !isAuthTokenValid(authToken))
    return NextResponse.json({ message: 'Not authorized!' }, { status: 401 });

  try {
    const formData = await req.formData();
    const uploadedFiles = formData.getAll('files'); // Array of File objects

    if (uploadedFiles.length === 0)
      return NextResponse.json({ message: 'No files received' }, { status: 400 });

    const client = new S3Client({
      region: 'us-east-1',
      credentials: {
        accessKeyId: process.env.CLOUDCUBE_ACCESS_KEY_ID,
        secretAccessKey: process.env.CLOUDCUBE_SECRET_ACCESS_KEY,
      },
    });

    const uploadPromises = uploadedFiles.map(async (file) => {
      const key = `${process.env.CLOUDCUBE_TOP_FOLDER}${file.name}`;

      const command = new PutObjectCommand({
        Bucket: process.env.CLOUDCUBE_BUCKET,
        Key: key,
        Body: await file.arrayBuffer(), // Convert File to ArrayBuffer (streams efficiently)
        ContentType: file.type || 'application/octet-stream',
      });

      const result = await client.send(command);
      console.info(`Uploaded ${file.name} to ${key}`);

      return { name: file.name, key, etag: result.ETag };
    });

    const results = await Promise.all(uploadPromises); // Concurrent uploads (safe for S3)

    revalidatePath('/admin/upload/overview');
    revalidatePath('/admin/upload/versions');

    return NextResponse.json({
      message: `${uploadedFiles.length} file(s) uploaded successfully!`,
      files: results, // Optional: Return uploaded details
    });
  } catch (error) {
    console.error('Upload Files - an error has occurred: ', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};


export {
  POST,
};
