export interface ReportTemplateDto {
  address: string;
  description: string;
  severity: string;
  reporterPhone: string;
}

export function generateReportTemplate(dto: ReportTemplateDto): string {
  const colors: Record<string, string> = {
    low: '#28a745',
    medium: '#ffc107',
    high: '#dc3545',
  };

  const severityColor = colors[dto.severity.toLowerCase()] || '#0077b6';

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Reporte de Fuga de Agua</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f4f7f6; margin: 0; padding: 20px; color: #333333;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border: 1px solid #e2e8f0;">
        <tr>
          <td style="background-color: #0077b6; padding: 20px; text-align: center; color: #ffffff;">
            <h2 style="margin: 0; font-size: 22px;">💧 AguaFix - Alerta de Fuga en Vía Pública</h2>
          </td>
        </tr>
        <tr>
          <td style="padding: 24px;">
            <p style="font-size: 15px; line-height: 1.5; margin-top: 0;">
              Se ha generado un nuevo reporte ciudadano de fuga de agua. A continuación se detallan los datos recabados:
            </p>
            <table width="100%" cellpadding="10" cellspacing="0" style="border-collapse: collapse; margin-top: 15px;">
              <tr style="border-bottom: 1px solid #edf2f7;">
                <td style="width: 35%; font-weight: bold; color: #4a5568;">📍 Dirección / Referencia:</td>
                <td style="color: #2d3748;">${dto.address}</td>
              </tr>
              <tr style="border-bottom: 1px solid #edf2f7;">
                <td style="font-weight: bold; color: #4a5568;">📝 Descripción del problema:</td>
                <td style="color: #2d3748;">${dto.description}</td>
              </tr>
              <tr style="border-bottom: 1px solid #edf2f7;">
                <td style="font-weight: bold; color: #4a5568;">⚠️ Nivel de Severidad:</td>
                <td>
                  <span style="display: inline-block; padding: 4px 10px; font-size: 12px; font-weight: bold; border-radius: 4px; color: #ffffff; text-transform: uppercase; background-color: ${severityColor};">
                    ${dto.severity}
                  </span>
                </td>
              </tr>
              <tr>
                <td style="font-weight: bold; color: #4a5568;">📞 Teléfono de Contacto:</td>
                <td style="color: #2d3748;">
                  <a href="tel:${dto.reporterPhone}" style="color: #0077b6; text-decoration: none; font-weight: bold;">
                    ${dto.reporterPhone}
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="background-color: #f8fafc; padding: 15px; text-align: center; font-size: 12px; color: #718096; border-top: 1px solid #e2e8f0;">
            Sistema Municipal de Agua y Saneamiento &bull; Cuadrilla de Mantenimiento
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}