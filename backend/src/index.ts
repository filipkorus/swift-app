import app from './app';
import logger from './utils/logger';
import {clearDB, initDB, populateDB} from './utils/database';
import config, {checkConfigFields} from '../config';

const setupDatabaseBeforeStart = async () => {
	const tasksToRunBeforeStart = [
		checkConfigFields,
		initDB,
		clearDB,
		populateDB
	];

	for (const task of tasksToRunBeforeStart) {
		logger.info(await task());
	}
};

// Do not start the server in test environment
if (config.NODE_ENV !== 'test') {
	setupDatabaseBeforeStart()
		.then(() => {
			app.listen(config.PORT, () =>
				logger.info(`Server listening on http://localhost:${config.PORT}`)
			);
		})
		.catch((error) => {
			logger.error(error);
			process.exit(1);
		});
}
