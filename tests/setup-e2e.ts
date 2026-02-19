import { envSchema } from '@/shared/services/env';
import { PrismaClient } from '@/generated/prisma/client';
import { config } from 'dotenv';
import { execSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { PrismaPg } from '@prisma/adapter-pg';

config({
	path: '.env',
	override: true,
});
config({
	path: '.env.test',
	override: true,
});

const env = envSchema.parse(process.env);

const adapter = new PrismaPg({
	connectionString: env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });


function generateUniqueDatabaseURL(schemaId: string) {
	if (!env.DATABASE_URL) {
		throw new Error('DATABASE_URL is not set');
	}

	const url = new URL(env.DATABASE_URL);

	url.searchParams.set('schema', schemaId);

	return url.toString();
}

const schemaId = randomUUID();

beforeAll(async () => {
	const databaseURL = generateUniqueDatabaseURL(schemaId);

	env.DATABASE_URL = databaseURL;

	execSync('npx prisma migrate deploy');
});

afterAll(async () => {
	await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`);
	await prisma.$disconnect();
});