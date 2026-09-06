import { Injectable, Logger } from '@nestjs/common';
import { ReportsRepository } from './repositories/reports.repository';
import { CreateReportDto } from './dtos/create-report.dto';
import { EmailService } from '../email/email.service';
import { generateReportTemplate } from './templates/report.template';
import { envs } from '../config/envs';

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);

  constructor(
    private readonly reportsRepository: ReportsRepository,
    private readonly emailService: EmailService,
  ) {}

  async create(createReportDto: CreateReportDto) {
    // 1. Guardar el reporte en la base de datos
    const report = await this.reportsRepository.create(createReportDto);

    // 2. Generar el correo con la plantilla HTML y enviarlo a la cuadrilla sin romper el flujo
    try {
      const htmlTemplate = generateReportTemplate(createReportDto);
      await this.emailService.sendEmail(
        envs.MAINTENANCE_EMAIL,
        `Nuevo Reporte de Fuga de Agua - Prioridad [${createReportDto.severity.toUpperCase()}]`,
        htmlTemplate,
      );
    } catch (error) {
      this.logger.error('Error al intentar enviar correo de notificación:', error);
    }

    return report;
  }

  async findAll() {
    return this.reportsRepository.findAll();
  }
}