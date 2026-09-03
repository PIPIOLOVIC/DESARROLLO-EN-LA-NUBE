import { DataSource, DataSourceOptions } from 'typeorm';
import { envs } from './envs';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: envs.DB_HOST,
  port: envs.DB_PORT,
  username: envs.DB_USERNAME,
  password: envs.DB_PASSWORD,
  database: envs.DB_NAME,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
  synchronize: false, // Requisito estricto: sin sincronización automática
};

const AppDataSource = new DataSource(dataSourceOptions);
export default AppDataSource;