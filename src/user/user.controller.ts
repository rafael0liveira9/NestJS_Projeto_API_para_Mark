import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Put,
  HttpCode,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findMe(@Req() req) {
    return this.userService.findMe(req);
  }

  @Get('all')
  findAll() {
    return this.userService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.userService.findOne(+id);
  // }

  @Post('search-user/:email')
  @HttpCode(200)
  findUser(@Param('email') email: string) {
    return this.userService.findOne(email);
  }

  @Post('search-user-register')
  @HttpCode(200)
  findUserByData(@Body() body: { email: string; document: string }) {
    return this.userService.findByData(body);
  }

  @Put('update-password')
  @HttpCode(200)
  update(@Body() UpdatePasswordDto: UpdatePasswordDto) {
    return this.userService.updatePassword(UpdatePasswordDto);
  }

  @Put('arrears/:id')
  @HttpCode(200)
  arrears(@Param('id') id: string) {
    return this.userService.arrears(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
