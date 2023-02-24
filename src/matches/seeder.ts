import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from './match.entity';
import { Tournament } from 'src/tournaments/tournament.entity';
import { Team } from 'src/teams/team.entity';
import { faker } from '@faker-js/faker';

@Injectable()
export class Seeder {
  constructor(
    @InjectRepository(Tournament)
    private tournamentsRepository: Repository<Tournament>,

    @InjectRepository(Team)
    private teamsRepository: Repository<Team>,

    @InjectRepository(Match)
    private matchesRepository: Repository<Match>,
  ) {}
  async seed() {
    if (await this.isSeeded()) return;
    const tournaments = await this.seedTournaments();
    const teams = await this.seedTeams();
    await this.seedMatches(tournaments, teams);
    console.log('Successfuly completed seeding...');
  }

  async isSeeded() {
    return this.tournamentsRepository.exist();
  }

  async seedTournaments() {
    const tournaments: Tournament[] = [];
    for (let index = 0; index < 5; index++) {
      const tournament = new Tournament();
      tournament.name = `Tournament ${index}`;
      tournament.description = faker.lorem.paragraph();
      tournaments.push(tournament);
    }

    await this.tournamentsRepository.save(tournaments);
    return tournaments;
  }

  async seedTeams() {
    const teams: Team[] = [];
    for (let index = 0; index < 100; index++) {
      const team = new Team();
      team.name = `Team ${index}`;
      team.image = faker.image.avatar();
      team.description = faker.lorem.paragraph();
      teams.push(team);
    }
    await this.teamsRepository.save(teams);
    return teams;
  }

  async seedMatches(tournaments: Tournament[], teams: Team[]) {
    const matches: Match[] = [];
    for (let index = 0; index < 2000; index++) {
      const match: Match = new Match();
      match.tournamentId = this.getRandom(tournaments).id;
      match.homeTeamId = this.getRandom(teams).id;
      match.awayTeamId = this.getRandom(teams).id;     
      if (index < 50) {
        match.startAt = new Date();
      } else {
        match.startAt = faker.date.past();
        match.endAt = this.addHours(new Date(match.startAt), 1.6);
        match.homeTeanScore = Math.floor(Math.random() * 5);
        match.awayTeamScore = Math.floor(Math.random() * 5);
      }
      matches.push(match);
    }
    await this.matchesRepository.save(matches);
  }

  getRandom<T>(items: T[]): T {
    return items[Math.floor(Math.random() * items.length)];
  }

  addHours(date: Date, hours: number) {
    date.setTime(date.getTime() + hours * 60 * 60 * 1000);
    return date;
  }
}
