import {Router} from 'express';
import {userRouter} from './routes/';

let router = Router();
router.use('/', userRouter);

export let apiRouter = router;

