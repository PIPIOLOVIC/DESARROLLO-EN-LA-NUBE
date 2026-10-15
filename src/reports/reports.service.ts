import { Injectable, Logger } from '@nestjs/common';
import { ReportsRepository } from './repositories/reports.repository';
import { CreateReportDto } from './dtos/create-report.dto';
import { EmailService } from '../email/email.service';
import { StorageService } from '../storage/storage.service';
import { generateReportTemplate } from './templates/report.template';
import { envs } from '../config/envs';

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);

  constructor(
    private readonly reportsRepository: ReportsRepository,
    private readonly emailService: EmailService,
    private readonly storageService: StorageService,
  ) {}

  async create(
    createReportDto: CreateReportDto,
    photo: Express.Multer.File,
  ) {
    // 1. Subir la foto a S3
    const photoUrl = await this.storageService.uploadFile(photo, 'reports/');

    // 2. Guardar el reporte en la base de datos con la URL de la foto
    const report = await this.reportsRepository.create({
      ...createReportDto,
      photoUrl,
    });

    // 3. Generar el correo con la plantilla HTML (incluye foto) y enviarlo a la cuadrilla
    try {
      const htmlTemplate = generateReportTemplate(createReportDto, photoUrl);
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