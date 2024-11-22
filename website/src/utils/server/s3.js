import 'server-only';
import { S3Client, paginateListObjectsV2 } from '@aws-sdk/client-s3';


const client = new S3Client({
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.CLOUDCUBE_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDCUBE_SECRET_ACCESS_KEY,
  },
});


const ListFiles = async prefix => {
  try {
    const paginator = paginateListObjectsV2(
      { client },
      {
       Bucket: process.env.CLOUDCUBE_BUCKET,
       Prefix: prefix,
      }
    );

    const files = [];
    for await (const page of paginator) {
      files.push(...page.Contents.map(file => file.Key));
    }

    return files;
  } catch (error) {
    console.error('Error listing objects: ', error);
    return null;
  }
};


export {
  ListFiles,
};
