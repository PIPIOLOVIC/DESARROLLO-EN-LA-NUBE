import { Injectable } from '@nestjs/common';
import { ReportsRepository } from './repositories/reports.repository';
import { CreateReportDto } from './dtos/create-report.dto';
import { EmailService } from '../email/email.service';
import { generateReportTemplate } from './templates/report.template';
import { envs } from '../config/envs';

@Injectable()
export class ReportsService {
  constructor(
    private readonly reportsRepository: ReportsRepository,
    private readonly emailService: EmailService,
  ) {}

  async create(createReportDto: CreateReportDto) {
    // 1. Guardar el reporte en la base de datos
    const report = await this.reportsRepository.create(createReportDto);

    // 2. Generar el correo con la plantilla HTML y enviarlo a la cuadrilla
    const htmlTemplate = generateReportTemplate(createReportDto);
    await this.emailService.sendEmail(
      envs.MAINTENANCE_EMAIL,
      `Nuevo Reporte de Fuga de Agua - Prioridad [${createReportDto.severity.toUpperCase()}]`,
      htmlTemplate,
    );

    return report;
  }

  async findAll() {
    return this.reportsRepository.findAll();
  }
}