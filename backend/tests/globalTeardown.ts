import {clearDB} from '../src/utils/database';
import prisma from '../src/lib/prisma';

export default async () => {
	await clearDB();
	prisma.$disconnect();
};
