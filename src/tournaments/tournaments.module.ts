import { Module } from '@nestjs/common';
import { TournamentsService } from './tournaments.service';
import { TournamentsController } from './tournaments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tournament } from './tournament.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tournament])],
  exports: [TypeOrmModule],
  providers: [TournamentsService],
  controllers: [TournamentsController]
})
export class TournamentsModule {}
