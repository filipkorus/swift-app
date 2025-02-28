import fs from 'fs';
import csv from 'csv-parser';
import config from '../../config';

interface CSVRow {
	[key: string]: string;
}

/**
 * Parses the Swift code CSV file and returns the data as an array of objects.
 */
const parseSwiftCodesCSV = async (): Promise<CSVRow[]> => {
	return new Promise((resolve, reject) => {
		const columnMapping: Record<string, string> = {
			'COUNTRY ISO2 CODE': 'countryISO2',
			'SWIFT CODE': 'swiftCode',
			'NAME': 'bankName',
			'ADDRESS': 'address',
			'COUNTRY NAME': 'countryName',
		};
		const results: CSVRow[] = [];

		fs.createReadStream(config.SWIFT_CODES_CSV_PATH)
			.pipe(csv())
			.on('data', (data: CSVRow) => {
				const renamedRow: CSVRow = {};
				for (const key in columnMapping) {
					if (data[key] === undefined) {
						continue;
					}
					renamedRow[columnMapping[key]] = data[key].trim();
				}
				results.push(renamedRow);
			})
			.on('end', () => resolve(results))
			.on('error', (error) => reject(error));
	});
};

export default parseSwiftCodesCSV;
