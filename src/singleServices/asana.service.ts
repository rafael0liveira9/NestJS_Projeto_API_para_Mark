import { Injectable } from '@nestjs/common';
import * as asana from 'asana';

@Injectable()
export class AsanaService {
  constructor(public asana: asana.Client) {
    asana = this.createClient();
  }

  createClient() {
    return asana.Client.create().useAccessToken(process.env.ASAAS_TOKEN);
  }
}
