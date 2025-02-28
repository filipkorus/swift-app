import {Router} from 'express';
import {GetSwiftCodeHandler, GetAllSwiftCodesByCCHandler, CreateSwiftCodeHandler, DeleteSwiftCodeHandler} from './swift-codes.controller';

const router = Router();

router.get('/:swiftCode', GetSwiftCodeHandler);
router.get('/country/:countryISO2', GetAllSwiftCodesByCCHandler);
router.post('/', CreateSwiftCodeHandler);
router.delete('/:swiftCode', DeleteSwiftCodeHandler);

export default router;
