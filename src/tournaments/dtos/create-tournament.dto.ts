import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateTournamentDto {
    @IsString()
    @IsNotEmpty()
    public name: string;

    @IsString()
    @IsOptional()
    public description: string;
  }