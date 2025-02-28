import prisma from '../lib/prisma';
import logger from './logger';
import {isoCountryCodesAndNamesArray} from './isoCountryCodesAndNames';
import parseSwiftCodesCSV from './parseSwiftCodesCSV';
import checkIsHeadquarterBySwift from './checkIsHeadquarterBySwift';
import {getCountryCodeToIdMap} from '../routes/v1/swift-codes/swift-codes.service';

/**
 * Initializes the database by checking the Prisma connection.
 * Ensures that the server can connect to the database successfully.
 *
 * @returns {Promise<string>} A promise that resolves with a success message or rejects with an error message.
 */
const initDB = async (): Promise<string> => {
	try {
		await prisma.$connect();
		return Promise.resolve('Database connection: OK');
	} catch (error) {
		logger.error(error);
		return Promise.reject('Database connection: FAILED');
	}
};

/**
 * Clears the database by deleting all records from the Country and Bank tables.
 *
 * @returns {Promise<string>} A promise that resolves with a success message or rejects with an error message.
 */
const clearDB = async (): Promise<string> => {
	try {
		await prisma.bank.deleteMany();
		await prisma.country.deleteMany();
		return Promise.resolve('Database clearing: OK');
	} catch (error) {
		logger.error(error);
		return Promise.reject('Database clearing: FAILED');
	}
};

/**
 * Populates the database with data from the ISO country codes and names array.
 *
 * @returns {Promise<void>} A promise that resolves when the database population is complete.
 */
const populateCountries = async (): Promise<void> => {
	await prisma.country.createMany({data: isoCountryCodesAndNamesArray});
};

/**
 * Populates the database with data from the SWIFT codes CSV file.
 *
 * @returns {Promise<void>} A promise that resolves when the database population is complete.
 */
const populateBanks = async (): Promise<void> => {
	const countryCodeToCountryIdMap = await getCountryCodeToIdMap() ?? {};
	const banksData = await parseSwiftCodesCSV();
	const banks = banksData.map(({swiftCode, bankName, address, countryISO2}) => ({
		swiftCode,
		bankName,
		address,
		isHeadquarter: checkIsHeadquarterBySwift(swiftCode),
		countryId: countryCodeToCountryIdMap[countryISO2] ?? null
	}));
	await prisma.bank.createMany({data: banks});
};

/**
 * Populates the database with data from the ISO country codes and names array and the SWIFT codes CSV file.
 *
 * @returns {Promise<string>} A promise that resolves with a success message or rejects with an error message.
 */
const populateDB = async (): Promise<string> => {
	try {
		await populateCountries();
		await populateBanks();

		return Promise.resolve('Database population: OK');
	} catch (error) {
		logger.error(error);
		return Promise.reject('Database population: FAILED');
	}
};

export {
	initDB,
	clearDB,
	populateDB
};
