import 'server-only';
import { S3Client, paginateListObjectsV2, GetObjectCommand } from '@aws-sdk/client-s3';


const client = new S3Client({
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.CLOUDCUBE_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDCUBE_SECRET_ACCESS_KEY,
  },
});


const compareVersions = (v1, v2) => { // Descending
  const v1Parts = v1.split('.').map(Number);
  const v2Parts = v2.split('.').map(Number);

  for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
    const part1 = v1Parts[i] || 0; // Default to 0 if undefined
    const part2 = v2Parts[i] || 0;

    if (part1 > part2) return -1; // v1 is greater
    if (part1 < part2) return 1; // v2 is greater
  }

  return 0; // Versions are equal
};


const listFiles = async prefix => {
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

  if (files.length === 0)
    throw new Error('No files found on server');

  // Parse the files into a json object
  const ret = {};
  const tierNames = ['Basic', 'Intermediate', 'Advanced'];
  for (const file of files) {
    const parts = file.split('/');
    const tier = parts[2];
    const tierLastCh = tier.charAt(tier.length - 1);
    if (parts.length !== 5 || !tier.startsWith('tier0') || !['1', '2', '3'].includes(tierLastCh))
      throw new Error(`Unexpected file paths: ${files.join(', ')}`);
    const version = parts[3];
    let fileName = parts[4];
    const tierNameId = +tierLastCh - 1;
    if (!Number.isSafeInteger(tierNameId) || tierNameId < 0 || tierNameId > 2)
      throw new Error(`Unexpected tierNameId: ${tierNameId}. Should be one of [0, 1, 2]`);
    const tierName = tierNames[tierNameId];
    if (fileName !== `ARR-Addin-${tierName}-Setup.exe`)
      throw new Error(`Bad file name encountered: ${fileName}\r\nFiles: ${files.join(', ')}`);
    if (!(tier in ret))
      ret[tier] = { versions: [], fileName };
    ret[tier].versions = [...ret[tier].versions, version];
  }

  for (const tier in ret) {
    ret[tier].versions.sort(compareVersions);
    if (ret[tier].versions.length > 11)
      ret[tier].versions.length = 11; // Truncate
  }

  return ret;
};


const downloadFile = async fileKey => {
  try {
    const command = new GetObjectCommand({
      Bucket: process.env.CLOUDCUBE_BUCKET,
      Key: fileKey,
    });

    const response = await client.send(command);

    // Convert the response body to a Buffer
    const bodyContents = await response.Body.transformToByteArray();

    return { bodyContents, contentType: response.ContentType };
  } catch (error) {
    console.error('Error downloading file:', error);
    throw error;
  }
};


export {
  listFiles,
  downloadFile,
};
