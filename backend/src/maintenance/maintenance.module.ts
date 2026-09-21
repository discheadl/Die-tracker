import { Module } from '@nestjs/common';
import { MaintenanceService } from './maintenance.service';
import { MaintenanceController } from './maintenance.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Maintenance } from './entities/maintenance.entity';
import { Die } from '../die/entities/die.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Maintenance, Die])],
  controllers: [MaintenanceController],
  providers: [MaintenanceService],
  exports: [MaintenanceService],
})
export class MaintenanceModule {}
