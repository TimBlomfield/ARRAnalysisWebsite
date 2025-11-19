import { NextResponse } from 'next/server';
import { redirect } from 'next/navigation';
import { DateTime } from 'luxon';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { TrialStatus } from '@prisma/client';
import { listAllFiles } from '@/utils/server/s3';
import db from '@/utils/server/db';


const POST = async req => {
  try {
    const { token } = await req.json();

    // Check if the token is valid
    const trialRequest = await db.trialRequest.findUnique({ where: { token} });
    if (!trialRequest || trialRequest.expiresAt < DateTime.now().toJSDate() || trialRequest.status !== TrialStatus.EMAIL_VERIFIED)
      return NextResponse.json({ redirect: true }, { status: 200 });

    let files = await listAllFiles(process.env.CLOUDCUBE_TOP_FOLDER);
    files = files.filter(file => file.name.includes('tier03')).sort((a, b) => a.name.localeCompare(b.name));
    const latestFile = files[files.length - 1];

    const client = new S3Client({
      region: 'us-east-1',
      credentials: {
        accessKeyId: process.env.CLOUDCUBE_ACCESS_KEY_ID,
        secretAccessKey: process.env.CLOUDCUBE_SECRET_ACCESS_KEY,
      },
    });

    // Add the version to the filename
    const arr = latestFile.name.split('/');
    const arrF = arr[arr.length - 1].split('.');
    const fileName = `ARR Analysis Excel Add-in (${arrF[0]}) [version ${arr[arr.length - 3]}].${arrF[1]}`;

    const presignedUrl = await getSignedUrl(
      client,
      new GetObjectCommand({
        Bucket: process.env.CLOUDCUBE_BUCKET,
        Key: latestFile.name,
        ResponseContentDisposition: `attachment; filename="${fileName}"`,
      }),
      { expiresIn: 15 * 60  }, // 15 minutes
    );

    // Increase the downloads count
    await db.trialRequest.update({
      where: { id: trialRequest.id },
      data: { downloads: trialRequest.downloads + 1 },
    });

    return NextResponse.json({ url: presignedUrl }, { status: 200 });
  } catch (err) {
    console.error('Trial download API error: ', err);
    return NextResponse.json({ message: err?.message ?? 'Something went wrong!' }, { status: 500 });
  }
};


export {
  POST,
};
