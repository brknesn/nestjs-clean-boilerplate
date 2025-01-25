import { registerAs } from '@nestjs/config';
import * as dotenv from 'dotenv';

dotenv.config();

const config = {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.APP_PORT, 10) || 3000,

    auth: {
        pepper: process.env.AUTH_PEPPER,
        saltRounds: process.env.AUTH_SALT_ROUNDS,
    },

    jwt: {
        secret: process.env.JWT_SECRET || 'secret',
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    },

    database: {
        host: process.env.DATABASE_HOST,
        port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
        user: process.env.DATABASE_USER,
        pass: process.env.DATABASE_PASS,
        dbName: process.env.DATABASE_NAME,
    },

    redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT, 10) || 6379,
        password: process.env.REDIS_PASSWORD,
    },

    hasuraAdminSecret: process.env.HASURA_ADMIN_SECRET,

    spApi: {
        clientId: process.env.SP_API_CLIENT_ID,
        clientSecret: process.env.SP_API_CLIENT_SECRET,
        refreshToken: process.env.SP_API_REFRESH_TOKEN,
    },
};

export default registerAs('appConfig', () => (config));