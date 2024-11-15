import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Timestamp,
} from 'typeorm';
import { Report } from 'src/report/report';
import { Annotation } from 'src/annotation/annotation';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  email: string;

  @Column({ type: 'varchar', length: 255 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  first_name: string;

  @Column({ type: 'varchar', length: 255 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  last_name: string;

  @Column({ type: 'text' })
  @IsString()
  @IsNotEmpty()
  picture: string;

  @Column({ type: 'varchar', length: 255, default: 'Handler' })
  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  role: string;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => Report, (report) => report.user_created)
  created_reports: Report[];

  @OneToMany(() => Report, (report) => report.user_assigned)
  assigned_reports: Report[];

  @OneToMany(() => Annotation, (annotation) => annotation.user)
  annotations: Annotation[];
}
