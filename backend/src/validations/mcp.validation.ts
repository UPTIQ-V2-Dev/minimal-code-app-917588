import Joi from 'joi';

const executeTool = {
    body: Joi.object().keys({
        tool: Joi.string().required(),
        inputs: Joi.object()
    })
};

const getTools = {};

const resetTools = {};

export default {
    executeTool,
    getTools,
    resetTools
};