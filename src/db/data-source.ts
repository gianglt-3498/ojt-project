import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '123456',
  database: process.env.DB_NAME || 'ojt_training',
  entities: [__dirname + '/../models/*.entity{.ts,.js}'],
  synchronize: process.env.TYPEORM_SYNC === 'true', // Use env to toggle sync
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
