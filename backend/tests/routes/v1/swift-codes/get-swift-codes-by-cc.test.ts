import app from '../../../../src/app';
import request =  require('supertest');

describe('SWIFT Codes API - Get SWIFT by ISO2 Country Code', () => {
	test('should return all SWIFT codes for a given ISO2 country code', async () => {
		const cc = 'PL';
		const res = await request(app).get(`/v1/swift-codes/country/${cc}`);
		expect(res.status).toBe(200);
		expect(res.body.countryISO2).toBe(cc);
		expect(res.body.countryName).toBe('POLAND');
		expect(Array.isArray(res.body.swiftCodes)).toBe(true);
		expect(res.body.swiftCodes.length).toBeGreaterThan(0);
	});

	test('should return 404 when no SWIFT codes are found for a given ISO2 country code', async () => {
		const cc = 'AF';
		const res = await request(app).get(`/v1/swift-codes/country/${cc}`);
		expect(res.status).toBe(404);
		expect(res.body).toHaveProperty('message', `No SWIFT codes found for ${cc}`);
	});

	test('should return 400 when an invalid ISO2 country code is provided', async () => {
		const cc = 'ZZ';
		const res = await request(app).get(`/v1/swift-codes/country/${cc}`);
		expect(res.status).toBe(400);
		expect(res.body.errors[0]).toHaveProperty('message', 'This countryISO2 does not exist');
	});
});
