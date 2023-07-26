import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  HttpCode,
} from '@nestjs/common';
import { CompanieService } from './companie.service';
import { CreateCompanieDto } from './dto/create-companie.dto';
import { UpdateCompanieDto } from './dto/update-companie.dto';
import { ChangeCompanieDto } from './dto/change-companie.dto';

@Controller('companie')
export class CompanieController {
  constructor(private readonly companieService: CompanieService) { }

  @Post()
  create(@Body() createCompanieDto: CreateCompanieDto, @Req() req) {
    return this.companieService.create(createCompanieDto, req);
  }

  @Get()
  @HttpCode(200)
  findAll() {
    return this.companieService.findAll();
  }

  @Get('me')
  @HttpCode(200)
  findMy(@Req() req) {
    return this.companieService.findMy(req);
  }

  @Post('change-active')
  @HttpCode(200)
  changeCompanie(@Body() changeCompanie: ChangeCompanieDto, @Req() req) {
    return this.companieService.activeCompany(changeCompanie, req);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companieService.findOne(+id);
  }

  @Get('/get-doc:document')
  findOneByDoc(@Param('document') document: string) {
    return this.companieService.findOneByDoc(document);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCompanieDto: UpdateCompanieDto,
  ) {
    return this.companieService.update(+id, updateCompanieDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companieService.remove(+id);
  }
}
