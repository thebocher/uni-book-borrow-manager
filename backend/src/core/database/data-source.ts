import { DataSource } from 'typeorm';
import { config } from 'dotenv';
config({ path: '../.env' });

const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.MYSQL_HOST,
    port: +(process.env.MYSQL_PORT || 3306),
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    entities: ['dist/src/modules/**/*.model.js'],
    migrations: ['dist/src/migrations/*.js'],
});

export default AppDataSource;