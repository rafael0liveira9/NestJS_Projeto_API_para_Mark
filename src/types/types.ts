import { Client, Employee } from '@prisma/client';

export interface ErrorReturn {
  Message: string;
  Code: number;
}

export interface ClientJToken extends Client {
  jwt: string;
}

export interface EmployeeJToken extends Employee {
  jwt: string;
}
