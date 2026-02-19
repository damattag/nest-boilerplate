import { envSchema } from '@/shared/services/env';
import 'dotenv/config';

const env = envSchema.parse(process.env);

const appEnv = env.NODE_ENV;
const allowedOrigins = env.ALLOWED_ORIGINS;

const permitedUrls = appEnv === 'development' ? true : allowedOrigins;

export const corsOptions = {
  origin: permitedUrls,
};
