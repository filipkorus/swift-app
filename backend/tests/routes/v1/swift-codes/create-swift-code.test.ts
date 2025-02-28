import app from '../../../../src/app';
import request =  require('supertest');

describe('SWIFT Codes API - Create SWIFT', () => {
	test('should not allow a SWIFT code ending with XXX to have isHeadquarter as false', async () => {
		const incorrectHeadquarterEntry = {
			address: '123 Test St',
			bankName: 'Test Bank',
			countryISO2: 'US',
			countryName: 'United States',
			isHeadquarter: false,
			swiftCode: 'AAABBBCCXXX',
		};
		const res = await request(app).post('/v1/swift-codes').send(incorrectHeadquarterEntry);
		expect(res.status).toBe(400);
		expect(res.body.errors[0]).toHaveProperty('message', 'SWIFT codes ending in "XXX" must be headquarters');
	});

	test('should not allow a SWIFT code not ending with XXX to have isHeadquarter as true', async () => {
		const incorrectBranchEntry = {
			address: '456 Branch St',
			bankName: 'Test Bank',
			countryISO2: 'US',
			countryName: 'United States',
			isHeadquarter: true,
			swiftCode: 'QQQPPPEEYUV',
		};
		const res = await request(app).post('/v1/swift-codes').send(incorrectBranchEntry);
		expect(res.status).toBe(400);
		expect(res.body.errors[0]).toHaveProperty('message', 'Headquarters must have a SWIFT code ending in "XXX"');
	});

	test('should not allow creating a SWIFT code with a non-existing country code', async () => {
		const nonExistentCountryEntry = {
			address: '789 NoCountry St',
			bankName: 'Ghost Bank',
			countryISO2: 'ZZ',
			countryName: 'Nowhere',
			isHeadquarter: true,
			swiftCode: 'NOBANKZZXXX',
		};
		const res = await request(app).post('/v1/swift-codes').send(nonExistentCountryEntry);
		expect(res.status).toBe(400);
		expect(res.body.errors[0]).toHaveProperty('message', 'This countryISO2 does not exist');
	});

	test('should not allow creating a SWIFT code where country code and country name do not match', async () => {
		const mismatchedCountryEntry = {
			address: '101 Mismatch St',
			bankName: 'Mismatch Bank',
			countryISO2: 'US',
			countryName: 'POLAND',
			isHeadquarter: true,
			swiftCode: 'MISBANKFXXX',
		};
		const res = await request(app).post('/v1/swift-codes').send(mismatchedCountryEntry);
		expect(res.status).toBe(400);
		expect(res.body.errors[0]).toHaveProperty('message', 'countryISO2 and countryName do not match');
	});

	test('should successfully create a headquarters SWIFT code', async () => {
		const validHeadquarterEntry = {
			address: '200 Branch St',
			bankName: 'Branch Bank',
			countryISO2: 'US',
			countryName: 'United States',
			isHeadquarter: true,
			swiftCode: 'HQBXKUSAXXX',
		};
		const res = await request(app).post('/v1/swift-codes').send(validHeadquarterEntry);
		expect(res.status).toBe(201);
		expect(res.body).toHaveProperty('message', 'SWIFT code added successfully');
	});

	test('should successfully create a branch SWIFT code', async () => {
		const validBranchEntry = {
			address: '200 Branch St',
			bankName: 'Branch Bank',
			countryISO2: 'US',
			countryName: 'United States',
			isHeadquarter: false,
			swiftCode: 'HQBXKUSAABC',
		};
		const res = await request(app).post('/v1/swift-codes').send(validBranchEntry);
		expect(res.status).toBe(201);
		expect(res.body).toHaveProperty('message', 'SWIFT code added successfully');
	});

	test('should not allow to create a branch SWIFT code without a headquarters', async () => {
		const branchSwiftCode = 'AQBTOUAAKIA';
		const headquarterSwiftCode = branchSwiftCode.slice(0, -3) + 'XXX';
		const invalidBranchEntry = {
			address: '200 Branch St',
			bankName: 'Branch Bank',
			countryISO2: 'US',
			countryName: 'United States',
			isHeadquarter: false,
			swiftCode: branchSwiftCode
		};
		const res = await request(app).post('/v1/swift-codes').send(invalidBranchEntry);
		expect(res.status).toBe(400);
		expect(res.body).toHaveProperty('message', `Headquarters with SWIFT code ${headquarterSwiftCode} do not exist. Please create a headquarters first.`);
	});

	test('should not allow to create a SWIFT code with an existing SWIFT code', async () => {
		const validBranchEntry = {
			address: '200 Branch St',
			bankName: 'Branch Bank',
			countryISO2: 'US',
			countryName: 'United States',
			isHeadquarter: false,
			swiftCode: 'BPHKPLPKCUS',
		};
		const res = await request(app).post('/v1/swift-codes').send(validBranchEntry);
		expect(res.status).toBe(409);
		expect(res.body).toHaveProperty('message', 'This SWIFT code already exists');
	});
});
