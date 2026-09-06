import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class CreateReportDto {
  @IsString()
  @IsNotEmpty({ message: 'La dirección o referencia es requerida' })
  address: string;

  @IsString()
  @IsNotEmpty({ message: 'La descripción es requerida' })
  description: string;

  @IsString()
  @IsIn(['low', 'medium', 'high'], {
    message: 'La severidad debe ser uno de los siguientes valores: low, medium, high',
  })
  severity: string;

  @IsString()
  @IsNotEmpty({ message: 'El teléfono del reportante es requerido' })
  reporterPhone: string;
}