import { Controller, Get, Post, Body, Patch, Param, Delete, ForbiddenException, NotFoundException } from '@nestjs/common';
import { DiesService } from './die.service';
import { CreateDieDto } from './dto/create-die.dto';
import { UpdateDieDto } from './dto/update-die.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthUser } from '../auth/types/jwt-payload.type';
import { UserRole } from '../users/entities/user.entity';

const OPERATOR_ALLOWED_FIELDS = ['hits', 'notes'];

@Controller('die')
export class DiesController {
  constructor(private readonly dieService: DiesService) {}

  @Roles(UserRole.ADMIN)
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
  async update(@Param('id') id: string, @Body() updateDieDto: UpdateDieDto, @CurrentUser() user: AuthUser) {
    if (user.role === UserRole.MAINTENANCE) {
      throw new ForbiddenException('Tu rol no puede editar dados');
    }

    if (user.role === UserRole.OPERATOR) {
      const disallowed = Object.keys(updateDieDto).filter((key) => !OPERATOR_ALLOWED_FIELDS.includes(key));
      if (disallowed.length > 0) {
        throw new ForbiddenException('Como operador solo puedes registrar golpes y notas');
      }

      if (updateDieDto.hits !== undefined) {
        const currentDie = await this.dieService.findOne(+id);
        if (!currentDie) throw new NotFoundException(`Die ${id} not found`);
        if (updateDieDto.hits < currentDie.hits) {
          throw new ForbiddenException('No puedes registrar menos golpes de los que ya tiene el dado');
        }
      }
    }

    return this.dieService.update(+id, updateDieDto);
  }

  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dieService.remove(+id);
  }
}
