import app from '../../../../src/app';
import request =  require('supertest');

describe('SWIFT Codes API - Get SWIFT', () => {
	test('should return branches when retrieving a headquarters SWIFT code', async () => {
		const headquartersSwiftCode = 'BPBIBGSFXXX';
		const res = await request(app).get(`/v1/swift-codes/${headquartersSwiftCode}`);
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty('swiftCode', headquartersSwiftCode);
		expect(Array.isArray(res.body.branches)).toBe(true);
		expect(res.body.branches.length).toBeGreaterThan(0);
	});

	test('should not return branches field when retrieving a branch SWIFT code', async () => {
		const branchSwiftCode = 'BPBIBGSFSEC';
		const res = await request(app).get(`/v1/swift-codes/${branchSwiftCode}`);
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty('swiftCode', branchSwiftCode);
		expect(res.body).not.toHaveProperty('branches');
	});

	test('should return 404 when trying to delete a non-existent SWIFT code', async () => {
		const res = await request(app).delete(`/v1/swift-codes/ANNAEEAAA12`);
		expect(res.status).toBe(404);
		expect(res.body).toHaveProperty('message', 'SWIFT code not found');
	});

	test('should return 404 when retrieving a non-existent SWIFT code', async () => {
		const res = await request(app).get('/v1/swift-codes/AAAAAAAAA12');
		expect(res.status).toBe(404);
		expect(res.body).toHaveProperty('message', 'SWIFT code not found');
	});

	test('should return 400 when SWIFT code provided is not 11 characters long', async () => {
		const res = await request(app).get('/v1/swift-codes/INVALID');
		expect(res.status).toBe(400);
		expect(res.body.errors[0]).toHaveProperty('message', 'swiftCode must be 11 characters long');
	});

	test('should return 400 when SWIFT code provided is not alphanumeric', async () => {
		const res = await request(app).get('/v1/swift-codes/AAAAAAN__A7');
		expect(res.status).toBe(400);
		expect(res.body.errors[0]).toHaveProperty('message', 'swiftCode must be alphanumeric');
	});
});
