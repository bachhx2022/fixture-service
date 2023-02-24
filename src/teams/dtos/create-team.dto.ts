import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateTeamDto {
    @IsString()
    @IsNotEmpty()
    public name: string;

    @IsString()
    @IsOptional()
    public image?: string;

    @IsString()
    @IsOptional()
    public description?: string;
  }