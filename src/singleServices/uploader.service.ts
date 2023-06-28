import { Injectable } from '@nestjs/common';
import { StorageClient } from '@supabase/storage-js';

@Injectable()
export class UploaderService {
  client = new StorageClient(process.env.STORAGE_URL, {
    apiKey: process.env.STORAGE_KEY,
    Authorization: `Bearer ${process.env.STORAGE_KEY}`,
  });
}
