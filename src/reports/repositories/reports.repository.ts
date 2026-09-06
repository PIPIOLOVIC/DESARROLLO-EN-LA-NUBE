import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from '../entities/report.entity';

@Injectable()
export class ReportsRepository {
  constructor(
    @InjectRepository(Report)
    private readonly repository: Repository<Report>,
  ) {}

  async create(reportData: Partial<Report>): Promise<Report> {
    const report = this.repository.create(reportData);
    return this.repository.save(report);
  }

  async findAll(): Promise<Report[]> {
    return this.repository.find({
      order: { createdAt: 'DESC' },
    });
  }
}