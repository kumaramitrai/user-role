import Joi from 'joi';

const createFeedrSchema = Joi.object({
    feedName: Joi.string().required().max(150),
    feedUrl: Joi.string().required().max(150),
    feedDescription: Joi.string().required().max(500),
});

const editFeedSchema = Joi.object({
    feedUrl: Joi.string().required(),
    feedDescription: Joi.string().required(),
});
const deleteFeedSchema = Joi.object({
    feedID: Joi.string().required(),
});
const feedAccessSchema = Joi.object({
    feedID: Joi.string().required(),
    userID: Joi.string().required(),
    canDelete : Joi.boolean(),
});
const revokeAccessSchema = Joi.object({
    feedID: Joi.string().required(),
    userID: Joi.string().required(),
    canDelete : Joi.boolean(),
});

export { createFeedrSchema, editFeedSchema, deleteFeedSchema, feedAccessSchema, revokeAccessSchema };
