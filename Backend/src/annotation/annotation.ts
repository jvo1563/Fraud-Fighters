import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Timestamp,
} from 'typeorm';
import { User } from 'src/user/user';
import { Report } from 'src/report/report';

@Entity('annotation')
export class Annotation {
  @PrimaryGeneratedColumn()
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @Column({ type: 'int' })
  @IsNumber()
  @IsNotEmpty()
  report_id: number;

  @Column({ type: 'varchar', length: 255 })
  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  title: string;

  @Column({ type: 'int' })
  @IsNumber()
  @IsNotEmpty()
  created_by: number;

  @Column({ type: 'text' })
  @IsString()
  @IsNotEmpty()
  annotation: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User, (user) => user.annotations, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'created_by' })
  user: User;

  @ManyToOne(() => Report, (report) => report.annotations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'report_id' })
  report: Report;
}
