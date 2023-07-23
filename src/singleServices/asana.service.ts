import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AsanaService {
  async createTask(taskName: string, notes: string) {
    try {
      let data = await axios.request({
        method: 'POST',
        url: 'https://app.asana.com/api/1.0/tasks',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          authorization: `Bearer ${process.env.ASANA_BEARER_TOKEN}`,
        },
        data: {
          data: {
            followers: [`${process.env.FOLLOWER_GID}`],
            projects: [`${process.env.PROJECT_GID}`],
            name: `${taskName}`,
            resource_subtype: 'default_task',
            notes: `${notes}`,
            workspace: `${process.env.WORKSPACE_GID}`,
          },
        },
      });

      return;
    } catch (error) {}
  }
}
