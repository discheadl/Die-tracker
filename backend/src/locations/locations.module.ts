import { Module } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { LocationsController } from './locations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from './entities/location.entity';
import { Die } from '../die/entities/die.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Location, Die])],
  controllers: [LocationsController],
  providers: [LocationsService],
  exports: [LocationsService]
})
export class LocationsModule {}
