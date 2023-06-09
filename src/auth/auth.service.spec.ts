import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '../singleServices/jwt.service';
import { PrismaService } from '../singleServices/prisma.service';
import { AsaasService } from 'src/singleServices/asaas.service';
import { LeadService } from 'src/lead/lead.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        PrismaService,
        AsaasService,
        LeadService,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
