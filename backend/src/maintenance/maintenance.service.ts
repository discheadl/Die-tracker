import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { UpdateMaintenanceDto } from './dto/update-maintenance.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Maintenance } from './entities/maintenance.entity';
import { Repository } from 'typeorm';
import { Die } from '../die/entities/die.entity';

@Injectable()
export class MaintenanceService {
  constructor (
    @InjectRepository(Maintenance)
    private maintenanceRepo: Repository<Maintenance>,

    @InjectRepository(Die)
    private dieRepo: Repository<Die>,
  ) {}

  async create(createMaintenanceDto: CreateMaintenanceDto) {
    const { dieId, ...maintenanceData } = createMaintenanceDto;

    const die = await this.dieRepo.findOneBy({ id: dieId })
    if (!die) throw new NotFoundException(`Die ${dieId} not found`)

    const maintenance = this.maintenanceRepo.create({ ...maintenanceData, die })
    return this.maintenanceRepo.save(maintenance);
  }

  findAll() {
    return this.maintenanceRepo.find({ relations: { die: true } });
  }

  async findOne(id: number) {
    const maintenance = await this.maintenanceRepo.findOne({ where: { id }, relations: { die: true } });
    if (!maintenance) throw new NotFoundException(`Maintenance ${id} not found`);

    return maintenance;
  }

  async update(id: number, updateMaintenanceDto: UpdateMaintenanceDto) {
    const maintenance = await this.maintenanceRepo.preload({ id, ...updateMaintenanceDto});
    if (!maintenance) throw new NotFoundException(`Maintenance ${id} not found`);

    return this.maintenanceRepo.save(maintenance);
  }

  async remove(id: number) {
    const maintenance = await this.maintenanceRepo.findOneBy({ id });
    if (!maintenance) throw new NotFoundException(`Maintenance ${id} not found`);

    return this.maintenanceRepo.remove(maintenance);
  }
}
