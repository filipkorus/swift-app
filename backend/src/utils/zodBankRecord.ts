import {z} from 'zod';
import {checkIfCountryCodeMatchesName, countryNames, isoCountryCodes} from './isoCountryCodesAndNames';
import checkIsHeadquarterBySwift from './checkIsHeadquarterBySwift';
import {Bank, Country} from '@prisma/client';

const zodBankRecord = {
	address: z.string({required_error: 'address is required'}).trim(),
	bankName: z.string({required_error: 'bankName is required'}).trim(),
	countryISO2: z.string({required_error: 'countryISO2 is required'})
		.trim()
		.length(2, 'countryISO2 must be 2 characters long')
		.toUpperCase()
		.refine(code => isoCountryCodes.has(code), 'This countryISO2 does not exist'),
	countryName: z.string({required_error: 'countryName is required'})
		.trim()
		.toUpperCase()
		.refine(name => countryNames.has(name), 'This country does not exist'),
	isHeadquarter: z.boolean({required_error: 'isHeadquarter is required'}),
	swiftCode: z.string({required_error: 'swiftCode is required'})
		.trim()
		.toUpperCase()
		.regex(/^[A-Z0-9]+$/, 'swiftCode must be alphanumeric')
		.length(11, 'swiftCode must be 11 characters long')
};

const zodCheckIfSwiftEndingWithXXXIsHQ = (
	data: Pick<Bank, 'address' | 'bankName' | 'isHeadquarter' | 'swiftCode'> & Pick<Country, 'countryISO2' | 'countryName'>,
	ctx: z.RefinementCtx
) => {
	// 1. Enforce that SWIFT code ending in "XXX" must be a headquarters
	if (checkIsHeadquarterBySwift(data.swiftCode) && !data.isHeadquarter) {
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			message: 'SWIFT codes ending in "XXX" must be headquarters',
			path: ['isHeadquarter'],
		});
	}

	// 2. If isHeadquarter is true, ensure swiftCode ends with "XXX"
	if (data.isHeadquarter && !checkIsHeadquarterBySwift(data.swiftCode)) {
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			message: 'Headquarters must have a SWIFT code ending in "XXX"',
			path: ['swiftCode'],
		});
	}

	// 3. Ensure countryISO2 matches countryName using checkIfCountryCodeMatchesName function
	if (!checkIfCountryCodeMatchesName(data.countryISO2, data.countryName)) {
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			message: 'countryISO2 and countryName do not match',
			path: ['countryISO2', 'countryName'],
		});
	}
};

export default zodBankRecord;

export {
	zodCheckIfSwiftEndingWithXXXIsHQ
};
