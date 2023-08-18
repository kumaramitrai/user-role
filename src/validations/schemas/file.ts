import Joi from 'joi';

const uploadSchema = Joi.object({
    name: Joi.string().required().max(150),
    isDirectory: Joi.string().required().valid('true', 'false'),
});

const pinSchema = Joi.object({
    fileID: Joi.string().guid({ version: 'uuidv4' }).required(),
});

const metadataSchema = Joi.object({
    key: Joi.string(),
    value: Joi.string(),
});

const editFileSchema = Joi.object({
    fileName: Joi.string().required().max(150),
    fileMetadata: Joi.array().items(metadataSchema).required(),
});

const uploadCIDSchema = Joi.object({
    fileName: Joi.string().required().max(150),
    fileCID: Joi.string().required(),
});

const deleteFilesSchema = Joi.object({
    fileIDs: Joi.array()
        .items(Joi.string().guid({ version: 'uuidv4' }))
        .required()
        .min(1),
});

const downloadSchema = Joi.object({
    fileID: Joi.string().guid({ version: 'uuidv4' }).required(),
});

export { uploadSchema, editFileSchema, pinSchema, uploadCIDSchema, deleteFilesSchema, downloadSchema };
