import logger from '../../../utils/logger';
import prisma from '../../../lib/prisma';
import {Bank, Country} from '@prisma/client';
import {PrismaClientKnownRequestError} from '@prisma/client/runtime/library';

/**
 * Creates a new bank in the database.
 * @param bank The bank to create.
 * @returns The created bank if successful, or an error message if not.
 */
export const createBank = async (
	bank: Omit<Bank, 'id' | 'countryId'> & Pick<Country, 'countryISO2'>
): Promise<{data: Bank, error: null} | {data: null, error: string}> => {
	try {
		const countryId = await prisma.country.findUnique({ where: { countryISO2: bank.countryISO2 } }).then(country => country?.id) as number;
		return {
			data: await prisma.bank.create({ data: {
				swiftCode: bank.swiftCode,
				bankName: bank.bankName,
				address: bank.address,
				isHeadquarter: bank.isHeadquarter,
				countryId
			}}),
			error: null
		};
	} catch (error) {
		if (error instanceof PrismaClientKnownRequestError) {
			if (error.code === 'P2002') {
				return {
					data: null,
					error: `This SWIFT code already exists`
				};
			}
		}

		return {
			data: null,
			error: error instanceof Error ? error.message : 'An error occurred while creating the SWIFT code'
		};
	}
};

/**
 * Deletes a bank from the database.
 * @param swiftCode The SWIFT code of the bank to delete.
 * @returns The deleted bank if successful, or an error message if not.
 */
export const deleteBank = async (swiftCode: string): Promise<{data: Bank, error: null} | {data: null, error: string}> => {
	try {
		return {
			data: await prisma.bank.delete({ where: { swiftCode } }),
			error: null
		};
	} catch (error) {
		return {
			data: null,
			error: error instanceof Error ? error.message : 'An error occurred while deleting the SWIFT code'
		};
	}
};

/**
 * Returns a map of country ISO2 codes to country IDs.
 */
export const getCountryCodeToIdMap = async () => {
	const countries = await prisma.country.findMany({
		select: { id: true, countryISO2: true },
	});

	return countries.reduce<Record<string, number>>((acc, country) => {
		acc[country.countryISO2] = country.id;
		return acc;
	}, {});
};

/**
 * Returns the name of a country given its ISO2 code.
 * @param countryISO2 The ISO2 code of the country.
 */
export const getCountryNameByISO2 = async (countryISO2: string) => {
	const country = await prisma.country.findUnique({
		where: { countryISO2 },
		select: { countryName: true },
	});

	return country?.countryName ?? null;
};

/**
 * Returns bank details given a SWIFT code.
 * @param swift The SWIFT code to search for.
 */
export const getBankBySwift = async (swift: string) => {
	const bank = await prisma.bank.findUnique({
		where: { swiftCode: swift },
		select: {
			address: true,
			bankName: true,
			isHeadquarter: true,
			swiftCode: true,
			country: {
				select: {countryISO2: true, countryName: true}
			}
		}
	});

	if (bank == null) {
		return null;
	}

	return {
		...bank,
		...bank.country,
		country: undefined
	};
};

/**
 * Checks if a bank's headquarters with a SWIFT code prefix exists.
 * @param swiftPrefix The SWIFT code prefix to search for.
 */
export const checkIfHeadquartersWithSwiftPrefixExists = async (swiftPrefix: string) => {
	const bank = await prisma.bank.findFirst({
		where: {
			swiftCode: {
				startsWith: swiftPrefix,
				endsWith: 'XXX'
			},
			isHeadquarter: true
		},
		select: { swiftCode: true }
	});

	return bank != null;
};

/**
 * Checks if a bank has branches.
 * @param swiftPrefix The SWIFT code prefix to search for.
 */
export const checkIfBankHasBranches = async (swiftPrefix: string) => {
	return (await prisma.bank.count({
		where: {
			swiftCode: {
				startsWith: swiftPrefix,
				not: {endsWith: 'XXX'}
			},
			isHeadquarter: false
		}
	})) > 0;
};

/**
 * Returns all bank branches given a SWIFT code prefix.
 * @param swiftPrefix The SWIFT code prefix to search for.
 */
export const getBankBranchesBySwiftPrefix = async (swiftPrefix: string) => {
	const banks = await prisma.bank.findMany({
		where: {
			swiftCode: {
				startsWith: swiftPrefix,
				not: {endsWith: 'XXX'}
			},
			isHeadquarter: false
		},
		select: {
			address: true,
			bankName: true,
			isHeadquarter: true,
			swiftCode: true,
			country: {
				select: {countryISO2: true}
			}
		}
	});

	return banks.map(bank => ({
		...bank,
		...bank.country,
		country: undefined
	}));
};

/**
 * Returns all SWIFT codes for a given country.
 * @param countryISO2 The ISO2 code of the country.
 */
export const getSwiftCodesByCountryISO2 = async (countryISO2: string) => {
	const banks = await prisma.bank.findMany({
		where: {
			country: {countryISO2},
		},
		select: {
			address: true,
			bankName: true,
			isHeadquarter: true,
			swiftCode: true,
			country: {
				select: {countryISO2: true}
			}
		}
	});

	return banks.map(bank => ({
		...bank,
		...bank.country,
		country: undefined
	}));
};
