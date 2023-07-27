import { Injectable } from '@nestjs/common';
import { StorageClient } from '@supabase/storage-js';

import { S3 } from 'aws-sdk';

@Injectable()
export class UploaderService {
  client = new S3({
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  });
}
