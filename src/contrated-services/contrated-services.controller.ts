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
import { ContratedServicesService } from './contrated-services.service';
import { CreateContratedServiceDto } from './dto/create-contrated-service.dto';
import { UpdateContratedServiceDto } from './dto/update-contrated-service.dto';

@Controller('contratedServices')
export class ContratedServicesController {
  constructor(
    private readonly contratedServicesService: ContratedServicesService,
  ) {}

  @Get()
  async findAll(@Req() req) {
    return await this.contratedServicesService.findAll(req);
  }
  @Get('all')
  async findAllAdmin() {
    return await this.contratedServicesService.findAllAdmin();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contratedServicesService.findById(+id);
  }
}
