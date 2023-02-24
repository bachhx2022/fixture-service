import { Team } from 'src/teams/team.entity';
import { Tournament } from 'src/tournaments/tournament.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@Index(['tournamentId', 'startAt'])
export class Match {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  tournamentId: string;

  @ManyToOne(() => Tournament)
  @JoinColumn({ name: 'tournamentId' })
  tournament: Tournament;

  @Column({ type: 'uuid' })
  homeTeamId: string;

  @ManyToOne(() => Team)
  @JoinColumn({ name: 'homeTeamId' })
  homeTeam: Team;

  @Column({ type: 'uuid' })
  awayTeamId: string;

  @ManyToOne(() => Team)
  @JoinColumn({ name: 'awayTeamId' })
  awayTeam: Team;

  @Column({ type: 'timestamptz' })
  startAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  endAt: Date;

  @Column('int', { nullable: true })
  homeTeanScore: number;

  @Column('int', { nullable: true })
  awayTeamScore: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
