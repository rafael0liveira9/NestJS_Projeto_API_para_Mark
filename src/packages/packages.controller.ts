import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { PackagesService } from './packages.service';
import { CreatePackageDto, PackagesSearch } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';

@Controller('package')
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  @Post()
  create(@Body() createPackageDto: CreatePackageDto) {
    console.log(createPackageDto);
    return this.packagesService.create(createPackageDto);
  }

  @Get('all')
  findAll() {
    return this.packagesService.findAll();
  }

  @Post('/search')
  findOne(@Body() packagesSearch: PackagesSearch) {
    return this.packagesService.findByValues(packagesSearch);
  }

  @Put('')
  updatePackage(@Body() UpdatePackageDto: UpdatePackageDto) {
    return this.packagesService.update(UpdatePackageDto);
  }

  @Get(':id')
  getService(@Param('id') id: string) {
    return this.packagesService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.packagesService.remove(+id);
  }
}
