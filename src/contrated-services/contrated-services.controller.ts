import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ContratedServicesService } from './contrated-services.service';
import { CreateContratedServiceDto } from './dto/create-contrated-service.dto';
import { UpdateContratedServiceDto } from './dto/update-contrated-service.dto';

@Controller('contratedServices')
export class ContratedServicesController {
  constructor(
    private readonly contratedServicesService: ContratedServicesService,
  ) {}

  @Post()
  create(@Body() createContratedServiceDto: CreateContratedServiceDto) {
    return this.contratedServicesService.create(createContratedServiceDto);
  }

  @Get()
  async findAll() {
    return await this.contratedServicesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contratedServicesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateContratedServiceDto: UpdateContratedServiceDto,
  ) {
    return this.contratedServicesService.update(+id, updateContratedServiceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contratedServicesService.remove(+id);
  }
}
