import app from '../../../../src/app';
import request =  require('supertest');

describe('SWIFT Codes API - Delete SWIFT', () => {
	test('should not allow deleting a headquarters SWIFT code when branches exist', async () => {
		const headquartersSwiftCode = 'BJSBMCMXXXX';
		const res = await request(app).delete(`/v1/swift-codes/${headquartersSwiftCode}`);
		expect(res.status).toBe(409);
		expect(res.body).toHaveProperty('message', 'Cannot delete headquarters with existing branches');
	});

	test('should successfully delete a branch SWIFT code', async () => {
		const branchSwiftCode = 'BKSACLRM055';
		const res = await request(app).delete(`/v1/swift-codes/${branchSwiftCode}`);
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty('message', 'SWIFT code deleted successfully');
	});

	test('should successfully delete a headquarters SWIFT code when no branches exist', async () => {
		const res = await request(app).delete('/v1/swift-codes/BLLGMTMBXXX');
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty('message', 'SWIFT code deleted successfully');
	});

	test('should return 400 when provided with an invalid (wrong length) SWIFT code', async () => {
		const res = await request(app).delete('/v1/swift-codes/INVALIDSWIFTCODE');
		expect(res.status).toBe(400);
		expect(res.body.errors[0]).toHaveProperty('message', 'swiftCode must be 11 characters long');
	});

	test('should return 400 when provided with an invalid (wrong length) SWIFT code', async () => {
		const res = await request(app).delete('/v1/swift-codes/INVALID_COD');
		expect(res.status).toBe(400);
		expect(res.body.errors[0]).toHaveProperty('message', 'swiftCode must be alphanumeric');
	});

	test('should return 404 when provided with a non-existent SWIFT code', async () => {
		const res = await request(app).delete('/v1/swift-codes/AAACEHJUXXX');
		expect(res.status).toBe(404);
		expect(res.body).toHaveProperty('message', 'SWIFT code not found');
	});
});
