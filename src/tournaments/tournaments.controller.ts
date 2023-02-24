import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateTournamentDto } from './dtos/create-tournament.dto';
import { TournamentsService } from './tournaments.service';

@Controller('tournaments')
export class TournamentsController {
  constructor(private readonly tournamentsService: TournamentsService) {}

  @Get()
  getAll() {
    return this.tournamentsService.findAll();
  }

  @Get('/:id')
  getById(@Param() { id }: { id: string }) {
    return this.tournamentsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateTournamentDto) {
    return this.tournamentsService.create(dto);
  }
}
