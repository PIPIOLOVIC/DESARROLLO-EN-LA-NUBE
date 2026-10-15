import { Injectable, Logger } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
} from '@aws-sdk/client-s3';
import { envs } from '../config/envs';
import { randomUUID } from 'crypto';
import { extname } from 'path';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({
      region: envs.AWS_REGION,
      credentials: {
        accessKeyId: envs.AWS_ACCESS_KEY_ID,
        secretAccessKey: envs.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  /**
   * Sube un archivo a S3 y devuelve la URL pública del objeto.
   * @param file   Buffer + metadatos del archivo (Express.Multer.File)
   * @param folder Carpeta destino dentro del bucket (e.g. "reports/")
   */
  async uploadFile(
    file: Express.Multer.File,
    folder: string,
  ): Promise<string> {
    const extension = extname(file.originalname);
    const normalizedFolder = folder.endsWith('/') ? folder : `${folder}/`;
    const key = `${normalizedFolder}${randomUUID()}${extension}`;

    const params: PutObjectCommandInput = {
      Bucket: envs.AWS_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    await this.s3Client.send(new PutObjectCommand(params));

    const url = `https://${envs.AWS_BUCKET_NAME}.s3.${envs.AWS_REGION}.amazonaws.com/${key}`;
    this.logger.log(`Archivo subido a S3: ${url}`);
    return url;
  }
}
