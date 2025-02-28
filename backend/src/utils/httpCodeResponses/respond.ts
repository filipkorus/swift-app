import {Response} from 'express';

const respond = (res: Response, message: string, statusCode: number, data: object) => res.status(statusCode).json({ message, ...data });

export default respond;
