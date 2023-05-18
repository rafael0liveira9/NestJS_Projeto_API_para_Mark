import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { CompanieService } from './companie.service';
import { CreateCompanieDto } from './dto/create-companie.dto';
import { UpdateCompanieDto } from './dto/update-companie.dto';

@Controller('companie')
export class CompanieController {
  constructor(private readonly companieService: CompanieService) {}

  @Post()
  create(@Body() createCompanieDto: CreateCompanieDto, @Req() req) {
    return this.companieService.create(createCompanieDto, req);
  }

  @Get()
  findAll() {
    return this.companieService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companieService.findOne(+id);
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
