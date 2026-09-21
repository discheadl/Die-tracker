import { Module } from '@nestjs/common';
import { DiesService } from './die.service';
import { DiesController } from './die.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Die } from './entities/die.entity';
import { Location } from '../locations/entities/location.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Die, Location])],
  controllers: [DiesController],
  providers: [DiesService],
})
export class DiesModule {}
