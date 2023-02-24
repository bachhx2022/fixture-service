import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTeamDto } from './dtos/create-team.dto';
import { Team } from './team.entity';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private teamsRepository: Repository<Team>,
  ) {}

  findAll() {
    return this.teamsRepository.find();
  }

  findOne(id: string) {
    return this.teamsRepository.findOneBy({ id });
  }

  public create(dto: CreateTeamDto) {
    const team: Team = new Team();
    team.name = dto.name;
    team.image = dto.image;
    team.description = dto.description;

    return this.teamsRepository.save(team);
  }
}
