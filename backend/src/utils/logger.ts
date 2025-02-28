import winston from 'winston';
import colors from '../utils/colors';
import config from '../../config';

interface ColorMap {
	[key: string]: string;
}

const levelColors: ColorMap = {
	info: colors.blue,
	debug: colors.yellow,
	warn: colors.yellow,
	error: colors.red,
	reset: colors.reset,
};

const logger = winston.createLogger({
	level: config.LOGGER.LEVEL,
	format: winston.format.combine(
		winston.format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
		winston.format.printf(({timestamp, level, message}) => {
			const color = levelColors[level];
			return `${timestamp} ${color}[${level.toUpperCase()}]${colors.reset}: ${message}`;
		})
	),
	transports: [
		new winston.transports.Console()
	]
});

export default logger;
