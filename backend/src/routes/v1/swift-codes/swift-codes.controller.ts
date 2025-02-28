import {Request, Response} from 'express';
import {z} from 'zod';
import validateObject from '../../../utils/validateObject';
import {
	createBank,
	deleteBank,
	getBankBranchesBySwiftPrefix,
	getBankBySwift, getSwiftCodesByCountryISO2,
	getCountryNameByISO2, checkIfHeadquartersWithSwiftPrefixExists, checkIfBankHasBranches
} from './swift-codes.service';
import {
	BAD_REQUEST,
	CONFLICT,
	CREATED,
	MISSING_BODY_FIELDS,
	MISSING_QUERY_PARAMS, NOT_FOUND,
	SUCCESS
} from '../../../utils/httpCodeResponses/messages';
import zodBankRecord, {zodCheckIfSwiftEndingWithXXXIsHQ} from '../../../utils/zodBankRecord';
import logger from '../../../utils/logger';

export const GetSwiftCodeHandler = async (req: Request, res: Response) => {
	const RequestSchema = z.object({ swiftCode: zodBankRecord.swiftCode });

	const validatedRequest = validateObject(RequestSchema, req.params);
	if (validatedRequest.data == null) {
		return MISSING_QUERY_PARAMS(res, validatedRequest.errors);
	}

	const bank = await getBankBySwift(validatedRequest.data.swiftCode);
	if (bank == null) {
		return NOT_FOUND(res, 'SWIFT code not found');
	}

	let branches = undefined;
	if (bank.isHeadquarter) {
		const swiftPrefix = validatedRequest.data.swiftCode.slice(0, -3);
		branches = await getBankBranchesBySwiftPrefix(swiftPrefix);
	}

	return SUCCESS(res, 'SWIFT code not found', {
		...bank,
		branches
	});
};

export const GetAllSwiftCodesByCCHandler = async (req: Request, res: Response) => {
	const RequestSchema = z.object({ countryISO2: zodBankRecord.countryISO2 });

	const validatedRequest = validateObject(RequestSchema, req.params);
	if (validatedRequest.data == null) {
		return MISSING_QUERY_PARAMS(res, validatedRequest.errors);
	}

	const countryName = await getCountryNameByISO2(validatedRequest.data.countryISO2);
	const swiftCodes = await getSwiftCodesByCountryISO2(validatedRequest.data.countryISO2);
	if (swiftCodes == null || swiftCodes.length === 0) {
		return NOT_FOUND(res, `No SWIFT codes found for ${validatedRequest.data.countryISO2}`);
	}

	return SUCCESS(res, 'SWIFT codes found for ${countryName}', {
		countryName,
		countryISO2: validatedRequest.data.countryISO2,
		swiftCodes
	});
};

export const CreateSwiftCodeHandler = async (req: Request, res: Response) => {
	const RequestSchema = z
		.object({ ...zodBankRecord })
		.superRefine(zodCheckIfSwiftEndingWithXXXIsHQ);

	const validatedRequest = validateObject(RequestSchema, req.body);
	if (validatedRequest.data == null) {
		return MISSING_BODY_FIELDS(res, validatedRequest.errors);
	}

	const {swiftCode, bankName, address, isHeadquarter, countryISO2} = validatedRequest.data;
	const swiftPrefix = swiftCode.slice(0, -3);

	if (!isHeadquarter && !(await checkIfHeadquartersWithSwiftPrefixExists(swiftPrefix))) {
		return BAD_REQUEST(res, `Headquarters with SWIFT code ${swiftPrefix}XXX do not exist. Please create a headquarters first.`);
	}

	const {error: errorMessage} = await createBank({
		swiftCode,
		bankName,
		address,
		isHeadquarter,
		countryISO2,
	});

	if (errorMessage !== null) {
		logger.debug(errorMessage);
		return CONFLICT(res, errorMessage);
	}

	return CREATED(res, `SWIFT code added successfully`);
};

export const DeleteSwiftCodeHandler = async (req: Request, res: Response) => {
	const RequestSchema = z.object({ swiftCode: zodBankRecord.swiftCode });

	const validatedRequest = validateObject(RequestSchema, req.params);
	if (validatedRequest.data == null) {
		return MISSING_QUERY_PARAMS(res, validatedRequest.errors);
	}

	const bank = await getBankBySwift(validatedRequest.data.swiftCode);
	if (bank == null) {
		return NOT_FOUND(res, 'SWIFT code not found');
	}

	const swiftPrefix = validatedRequest.data.swiftCode.slice(0, -3);
	if (bank.isHeadquarter && (await checkIfBankHasBranches(swiftPrefix))) {
		return CONFLICT(res, 'Cannot delete headquarters with existing branches');
	}

	await deleteBank(validatedRequest.data.swiftCode);

	return SUCCESS(res, 'SWIFT code deleted successfully');
};
