import {createBank, deleteBank, getCountryCodeToIdMap} from '../../../../src/routes/v1/swift-codes/swift-codes.service';

describe('SWIFT service', () => {
	test('should not allow to create a SWIFT code with invalid country id', async () => {
		const invalidBankEntry = {
			swiftCode: 'INVALIDCXXX',
			bankName: 'Invalid Bank',
			address: '101 Invalid St',
			isHeadquarter: true,
			countryISO2: 'ZZ'
		};
		const {data} = await createBank(invalidBankEntry);
		expect(data).toBe(null);
	});

	test('should return error when deleting a non-existent SWIFT code', async () => {
		const {data, error} = await deleteBank('NONEXISTXXX');
		expect(data).toBe(null);
		expect(error).not.toBe(null);
	});

	test('getCountryCodeToIdMap should return a map of country ISO2 codes to country names', async () => {
		const countryMap = await getCountryCodeToIdMap();
		expect(countryMap).toHaveProperty('US');
		expect(countryMap).toHaveProperty('CA');
		expect(countryMap).toHaveProperty('GB');
		expect(countryMap).toHaveProperty('DE');
		expect(countryMap).toHaveProperty('FR');
		expect(countryMap).toHaveProperty('AU');
		expect(countryMap).toHaveProperty('JP');
		expect(countryMap).toHaveProperty('CN');
	});
});
