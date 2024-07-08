import type { S3ClientConfig } from "@aws-sdk/client-s3";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { captureException } from "@sentry/nextjs";
import { useState } from "react";
import { v4 as uuid } from "uuid";

const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

let s3Configuration: S3ClientConfig = {};

if (accessKeyId && secretAccessKey) {
  s3Configuration = {
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
    region: "eu-west-1",
  };
}
interface Props {
  uploadFromUrl: (url: string) => Promise<void>;
  uploadUrl?: string;
  error: Error | null | unknown;
}

const urlPrefix = "https://tn-web-uploads.s3-eu-west-1.amazonaws.com/";

export const uploadToS3 = async (url: string) => {
  const response = await fetch(url);
  const blob = await response.blob();
  let fileName = uuid();
  fileName = `${fileName.slice(0, 8).replace(/.{2}/g, "$&/")}${fileName}`;
  const ext = blob.type.split("/")[1];
  fileName += `.${ext}`;

  if (!s3Configuration) {
    throw new Error("S3 is not configured");
  }
  const s3 = new S3Client(s3Configuration);
  const command = new PutObjectCommand({
    Bucket: "tn-web-uploads",
    Key: fileName,
    Body: blob,
    // ContentEncoding: 'base64',
    ContentType: blob.type,
    ACL: "public-read",
  });
  await s3.send(command);

  return urlPrefix + fileName;
};

export const useAwsUpload = (): Props => {
  const [uploadUrl, setUploadUrl] = useState<string>("");
  const [error, setError] = useState<Error | null>(null);

  const uploadFromUrl = async (url: string) => {
    try {
      const uploadedUrl = await uploadToS3(url);
      setUploadUrl(uploadedUrl);
    } catch (err) {
      captureException(err);

      if (err instanceof Error) {
        setError(err);
      }
    }
  };

  return { uploadFromUrl, uploadUrl, error };
};
