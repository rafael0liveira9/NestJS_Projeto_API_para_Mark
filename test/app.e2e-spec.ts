import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app/app.module';
import { Client, User } from '@prisma/client';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/').expect(200).expect('OK!');
  });

  describe('get userData', () => {
    it('userData', () => {
      return request(app.getHttpServer())
        .get('/users')
        .expect(200)
        .expect(Array<User>);
    });
  });

  describe('create user', () => {
    it('create user data', () => {
      const payload = {
        email: 'admin@admin.com9',
        password: 'Matheu123th@',
        name: 'Matheus CD`s',
        document: '708.555.324-32',
        documentType: 'CPF',
        phone: '84 996433769',
        firebaseToken: '123123123',
      };

      return request(app.getHttpServer())
        .post('/auth/signup')
        .send(payload)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect(201);
    });
  });
});
