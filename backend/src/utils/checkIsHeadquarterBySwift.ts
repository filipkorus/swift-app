/**
 * Check if the swift code is a bank's headquarters.
 * @param swift The SWIFT code to check.
 */
const checkIsHeadquarterBySwift = (swift: string): boolean => {
	return swift.endsWith('XXX');
};

export default checkIsHeadquarterBySwift;
