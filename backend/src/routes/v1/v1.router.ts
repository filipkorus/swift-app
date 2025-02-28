import {Router} from 'express';
import swiftCodesRouter from './swift-codes/swift-codes.router';

const router = Router();

router.use('/swift-codes', swiftCodesRouter);

export default router;
