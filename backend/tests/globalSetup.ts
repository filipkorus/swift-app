import {checkConfigFields} from '../config';
import {clearDB, initDB, populateDB} from '../src/utils/database';

export default async () => {
	await checkConfigFields();
	await initDB();
	await clearDB();
	await populateDB();
};
