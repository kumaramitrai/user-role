/** import packages [start] */
import express from 'express';
/** import packages [end] */

/** import custom dependency [start] */
import userRouter from './user';
import feedRouter from './feed';
/** import custom dependency [end] */

const router = express.Router();

// register routes here
router.use('/api/v1/user', userRouter);
router.use('/api/v1/feed', feedRouter);

export default router;
