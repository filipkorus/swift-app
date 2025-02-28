import checkObjectValuesNotNull from '../../src/utils/checkObjectValuesNotNull';

describe("checkObjectValuesNotNull", () => {
	test("should return undefined for an object with no null or undefined values", () => {
		const obj = {
			a: 1,
			b: "test",
			c: { d: true, e: [1, 2, 3] },
		};
		expect(checkObjectValuesNotNull(obj)).toBeUndefined();
	});

	test("should return the first null field path", () => {
		const obj = {
			a: 1,
			b: null,
			c: { d: true, e: "value" },
		};
		expect(checkObjectValuesNotNull(obj)).toBe("b");
	});

	test("should return the first undefined field path", () => {
		const obj = {
			a: 1,
			b: "test",
			c: { d: undefined, e: "value" },
		};
		expect(checkObjectValuesNotNull(obj)).toBe("c.d");
	});

	test("should return the first deeply nested null field path", () => {
		const obj = {
			a: 1,
			b: "test",
			c: { d: true, e: { f: null } },
		};
		expect(checkObjectValuesNotNull(obj)).toBe("c.e.f");
	});

	test("should return the first deeply nested undefined field path", () => {
		const obj = {
			a: 1,
			b: "test",
			c: { d: true, e: { f: { g: undefined } } },
		};
		expect(checkObjectValuesNotNull(obj)).toBe("c.e.f.g");
	});
});
