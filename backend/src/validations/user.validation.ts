import { Role } from '../generated/prisma/index.js';
import { password } from './custom.validation.ts';
import Joi from 'joi';

const createUser = {
    body: Joi.object().keys({
        email: Joi.string().required().email(),
        password: Joi.string().required().custom(password),
        name: Joi.string().required(),
        role: Joi.string().required().valid(...Object.values(Role))
    })
};

const getUsers = {
    query: Joi.object().keys({
        name: Joi.string(),
        role: Joi.string().valid(...Object.values(Role)),
        sortBy: Joi.string(),
        limit: Joi.number().integer().min(1).max(100),
        page: Joi.number().integer().min(1)
    })
};

const getUser = {
    params: Joi.object().keys({
        userId: Joi.string().required().pattern(/^\d+$/).message('User ID must be a valid number')
    })
};

const updateUser = {
    params: Joi.object().keys({
        userId: Joi.string().required().pattern(/^\d+$/).message('User ID must be a valid number')
    }),
    body: Joi.object()
        .keys({
            email: Joi.string().email(),
            password: Joi.string().custom(password),
            name: Joi.string()
        })
        .min(1)
};

const deleteUser = {
    params: Joi.object().keys({
        userId: Joi.string().required().pattern(/^\d+$/).message('User ID must be a valid number')
    })
};

export default {
    createUser,
    getUsers,
    getUser,
    updateUser,
    deleteUser
};
