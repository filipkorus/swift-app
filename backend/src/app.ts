import express from 'express';
import cors from 'cors';
import router from './routes/main.router';
import requestLogger from './middlewares/requestLogger';
import {NOT_FOUND} from './utils/httpCodeResponses/messages';
import config from '../config';

const app = express();

app.use(cors({
	origin: config.ALLOWED_ORIGINS,
	credentials: true
}));
app.use(express.json());
app.use(requestLogger);

app.use('/', router);

app.use('*', (_, res) => NOT_FOUND(res));

export default app;
