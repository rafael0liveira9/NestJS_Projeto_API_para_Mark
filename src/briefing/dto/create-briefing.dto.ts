import { ApiProperty } from '@nestjs/swagger';
import { FormatStyles, SocialImageBase } from '@prisma/client';

class CreateBriefingDefaultData {
  @ApiProperty()
  companieId: number;
  @ApiProperty()
  id: number;
}

export class CreateBriefingLogoDto extends CreateBriefingDefaultData {
  @ApiProperty()
  format: FormatStyles;
  @ApiProperty()
  cores: string;
  @ApiProperty()
  typography: string;
  @ApiProperty()
  especification: 'EMPRESA' | 'PRODUTO' | 'SERVICO';
  @ApiProperty()
  references: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  mockups: string;
}

export class CreateBriefingSiteDto extends CreateBriefingDefaultData {
  @ApiProperty()
  siteModel: 'ONEPAGE' | 'MULTIPAGE' | 'LANDPAGE' | 'MOBILEFIRST' | 'NONE';
  @ApiProperty()
  url: string;
  @ApiProperty()
  logo: string;
  @ApiProperty()
  contactData: string;
  @ApiProperty()
  socialMidia: string;
  @ApiProperty()
  references: string;
}

export class CreateBriefingSocialDto extends CreateBriefingDefaultData {
  @ApiProperty()
  network: 'FACEBOOK' | 'INSTAGRAM' | 'TIKTOK' | 'YOUTUBE' | 'LINKEDIN';
  @ApiProperty()
  image: SocialImageBase;
  @ApiProperty()
  materiaQuantity: 'DIARIO' | 'SEMANAL' | 'MENSAL';
  @ApiProperty()
  materiaFormat: 'FEED' | 'STORIES' | 'REELS';
  @ApiProperty()
  service:
    | 'PLANEJAMENTO_GERAL'
    | 'PLANEJAMENTO_REDACIONAL'
    | 'PLANEJAMENTO_VISUAL'
    | 'PLANEJAMENTO_POSTAGENS'
    | 'PLANEJAMENTO_GESTAO';
  @ApiProperty()
  daysHours: string;
}
