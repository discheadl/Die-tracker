import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDieDto } from './dto/create-die.dto';
import { UpdateDieDto } from './dto/update-die.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Die } from './entities/die.entity';
import { Location } from '../locations/entities/location.entity';

@Injectable()
export class DiesService {
  constructor (
    @InjectRepository(Die)
    private dieRepo: Repository<Die>,

    @InjectRepository(Location) 
    private locationRepo: Repository<Location>
  ) {}

  async create(createDieDto: CreateDieDto) {
    const { locationId, ...dieData } = createDieDto;
    const location = await this.locationRepo.findOneBy({ id: locationId });
    if(!location) throw new NotFoundException(`Location ${locationId} not found`)

    const die = this.dieRepo.create({ ...dieData, location });
    return this.dieRepo.save(die);
  }

  findAll() {
    return this.dieRepo.find({ relations: {location: true} });
  }

  findOne(id: number) {
    return this.dieRepo.findOne({ where: { id }, relations: { location: true }}) ;
  }

  async update(id: number, updateDieDto: UpdateDieDto) {
    const { locationId, ...dieData } = updateDieDto;

    let location;
    if(locationId !== undefined) {
      location = await this.locationRepo.findOneBy({ id: locationId });
      if (!location) throw new NotFoundException(`Location ${locationId} not found`)
    }
    
    const die = await this.dieRepo.preload({ id, ...dieData, ...(location && {location})});
    if(!die) throw new NotFoundException(`Die ${id} not found`);
    
    return this.dieRepo.save(die)
  }

  async remove(id: number) {
    const die = await this.dieRepo.findOneBy({ id });
    if(!die) throw new NotFoundException(`Die ${id} not found`);

    return this.dieRepo.remove(die);
  }
}
