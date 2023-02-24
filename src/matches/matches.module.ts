import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from 'src/teams/team.entity';
import { Tournament } from 'src/tournaments/tournament.entity';
import { Match } from './match.entity';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';
import { Seeder } from './seeder';

@Module({
  imports: [TypeOrmModule.forFeature([Match, Team, Tournament]),],
  exports: [TypeOrmModule],
  controllers: [MatchesController],
  providers: [MatchesService, Seeder]
})
export class MatchesModule {}
