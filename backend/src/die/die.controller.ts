import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DiesService } from './die.service';
import { CreateDieDto } from './dto/create-die.dto';
import { UpdateDieDto } from './dto/update-die.dto';

@Controller('die')
export class DiesController {
  constructor(private readonly dieService: DiesService) {}

  @Post()
  create(@Body() createDieDto: CreateDieDto) {
    return this.dieService.create(createDieDto);
  }

  @Get()
  findAll() {
    return this.dieService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dieService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDieDto: UpdateDieDto) {
    return this.dieService.update(+id, updateDieDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dieService.remove(+id);
  }
}
