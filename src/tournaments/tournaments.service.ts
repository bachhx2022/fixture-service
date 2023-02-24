import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTournamentDto } from './dtos/create-tournament.dto';
import { Tournament } from './tournament.entity';

@Injectable()
export class TournamentsService {
  constructor(
    @InjectRepository(Tournament)
    private tournamentsRepository: Repository<Tournament>,
  ) {}

  findAll(): Promise<Tournament[]> {
    return this.tournamentsRepository.find();
  }

  findOne(id: string): Promise<Tournament> {
    return this.tournamentsRepository.findOneBy({ id });
  }

  public create(dto: CreateTournamentDto): Promise<Tournament> {
    const tournament: Tournament = new Tournament();
    tournament.name = dto.name;
    tournament.description = dto.description;

    return this.tournamentsRepository.save(tournament);
  }
}
