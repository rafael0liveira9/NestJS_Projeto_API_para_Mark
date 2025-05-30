import { ApiProperty } from '@nestjs/swagger';
import {
  EspecificationTypes,
  FormatStyles,
  SocialMediaType,
} from '@prisma/client';

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
  title: string;
  @ApiProperty()
  subtitle: string;
  @ApiProperty()
  typography: string;
  @ApiProperty()
  especification: EspecificationTypes;
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
  logo: string;
  @ApiProperty()
  contactData: string;
  @ApiProperty()
  socialMidia: string;
  @ApiProperty()
  references: string;
  @ApiProperty()
  archives: string[];
  @ApiProperty()
  colors: string[];
  @ApiProperty()
  url: string;
  @ApiProperty()
  urlName: string;
  @ApiProperty()
  host: string;
  @ApiProperty()
  hostLogin: string;
  @ApiProperty()
  hostPass: string;
  @ApiProperty()
  urlLogin: string;
  @ApiProperty()
  urlPass: string;
  @ApiProperty()
  urlBriefing: string;
}

export class CreateBriefingSocialDto extends CreateBriefingDefaultData {
  @ApiProperty()
  materiaFormat: SocialMediaType;
  @ApiProperty()
  productImages: {
    url: string;
  }[];
  @ApiProperty()
  weekDays: {
    day: string;
  }[];
  @ApiProperty()
  daysHours: string;
  @ApiProperty()
  mediaReference: string;
  @ApiProperty()
  socialTalk: string;
  @ApiProperty()
  socialProductText: string;
}
