import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateTeamDto } from './dtos/create-team.dto';
import { TeamsService } from './teams.service';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get()
  getAll() {
    return this.teamsService.findAll();
  }

  @Get('/:id')
  getById(@Param() { id }: { id: string }) {
    return this.teamsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateTeamDto) {
    return this.teamsService.create(dto);
  } 
}
