import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './entities/location.entity';
import { Die } from '../die/entities/die.entity';

@Injectable()
export class LocationsService {
  constructor (
      @InjectRepository(Location)
      private locationRepo: Repository<Location>,

      @InjectRepository(Die)
      private dieRepo: Repository<Die>,
    ) {}

  create(createLocationDto: CreateLocationDto) {
    const location = this.locationRepo.create(createLocationDto);
    return this.locationRepo.save(location);
  }

  findAll() {
    return this.locationRepo.find();
  }

  async findOne(id: number) {
    const location = await this.locationRepo.findOne({ where: { id }, relations: { dies: true } });
    if (!location) throw new NotFoundException(`Location ${id} not found`);

    return location;
  }

  async update(id: number, updateLocationDto: UpdateLocationDto) {
    const location = await this.locationRepo.preload({ id, ...updateLocationDto });
    if (!location) throw new NotFoundException(`Location ${id} not found`);

    return this.locationRepo.save(location);
  }

  async remove(id: number) {
    const location = await this.locationRepo.findOneBy({ id });
    if (!location) throw new NotFoundException(`Location ${id} not found`);

    const diesCount = await this.dieRepo.countBy({ location: { id } });
    if (diesCount > 0) throw new ConflictException(`Location ${id} still has ${diesCount} die(s) assigned`);

    return this.locationRepo.remove(location);
  }
}
