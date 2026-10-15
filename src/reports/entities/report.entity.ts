import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'WATER_REPORT' })
export class Report {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 255 })
  address: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 10 })
  severity: string;

  @Column({ type: 'varchar', length: 20 })
  reporterPhone: string;

  @Column({ type: 'boolean', default: false })
  isResolved: boolean;

  @Column({ type: 'text', nullable: true })
  photoUrl: string;

  @Column({ type: 'text', nullable: true })
  repairPhotoUrl: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}