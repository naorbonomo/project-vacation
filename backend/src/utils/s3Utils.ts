// backend/src/utils/s3Utils.ts

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { appConfig } from "./appConfig";

const s3Client = new S3Client({
  region: appConfig.s3Config.region,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

export async function uploadFileToS3(file: Express.Multer.File): Promise<string> {
  const params = {
    Bucket: appConfig.s3Config.bucketName,
    Key: `vacations/${Date.now()}-${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);

  // Generate a pre-signed URL for the uploaded object
  const signedUrlCommand = new PutObjectCommand(params);
  const signedUrl = await getSignedUrl(s3Client, signedUrlCommand, { expiresIn: 3600 });

  return signedUrl;
}