/** import packages [start] */
import express from 'express';
/** import packages [end] */

/** import custom dependency [start] */
import feedController from '../controller/v1/feed';
import {
    paginationSchema,
    createFeedrSchema,
    editFeedSchema,
    deleteFeedSchema,
    feedAccessSchema,
    revokeAccessSchema,
} from '../validations/schemas';
import validate from '../validations/validate';
import { enableCors } from '../modules/http-server/middlewares';
import authenticationMiddleware from '../middlewares/authentication';
/** import custom dependency [end] */

const router = express.Router({ mergeParams: true });

enableCors(router);

router.post('/', authenticationMiddleware, validate(createFeedrSchema), feedController.create);
router.get('/', authenticationMiddleware, validate(paginationSchema, 'query'), feedController.feedList);
router.get('/:feed_id', authenticationMiddleware, validate(paginationSchema, 'query'), feedController.getFeedDetail);
router.put('/:feedID', authenticationMiddleware, validate(editFeedSchema), feedController.updateFeed);
router.delete('/:feedID', authenticationMiddleware, validate(deleteFeedSchema, 'params'), feedController.deleteFeed);
router.post('/grant-access', authenticationMiddleware, validate(feedAccessSchema), feedController.grantFeedAccess);
router.post('/revoke-access', authenticationMiddleware, validate(revokeAccessSchema), feedController.revokeFeedAccess);

export default router;
