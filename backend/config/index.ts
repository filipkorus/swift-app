import 'dotenv/config';
import checkObjectValuesNotNull from '../src/utils/checkObjectValuesNotNull';
import path from 'path';
import {config as dotenvConfig} from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
	dotenvConfig({
		path: path.join(__dirname, '..', '.env.dev')
	});
}

const config = {
	NODE_ENV: process.env.NODE_ENV,
	PORT: process.env.PORT,
	ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS?.split(';') ?? [],
	LOGGER: {
		LEVEL: process.env.LOG_LEVEL ?? 'debug',
	},
	DATABASE_URL: process.env.DATABASE_URL,
	SWIFT_CODES_CSV_PATH: path.join(__dirname, '../src/static/SWIFT_CODES.csv')
} as const;

/**
 * Checks if all config fields are not null or undefined.
 */
const checkConfigFields = (): Promise<string> => {
	const nullConfigFieldPath = checkObjectValuesNotNull(config);

	if (typeof nullConfigFieldPath === 'string') {
		return Promise.reject(`Config field (config.${nullConfigFieldPath}) is null or undefined`);
	}

	return Promise.resolve('Checking config values: OK');
}

export {checkConfigFields};

export default config;
