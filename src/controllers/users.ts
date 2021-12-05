import { ResponseToolkit, Request } from '@hapi/hapi';
import Joi from 'joi';
import mongoose from 'mongoose';
import { Error400, UserModel } from '../resources';
import User from "../models/users";

export const userController = (): any => {
    return [{
        method: 'POST',
        path: '/users',
        options: {
            tags: ['api', 'users'],
            description: 'Create new User document',
            plugins: {
                'hapi-swagger': {
                    payloadType: 'form',
                    responses: {
                        200: {
                            schema: UserModel
                        },
                        400: {
                            schema: Error400
                        }
                    }
                }
            },
            handler: async (req: Request, h: ResponseToolkit) => {
                try {
                    const data = await User.create(req.payload);
                    return data.toJSON();
                } catch (e) {
                    return h.response(e).code(e.statusCode || 500);
                }
            },
            validate: {
                payload: Joi.object({
                    name: Joi.string().required(),
                    hobbies: Joi.array().items(require('joi-objectid')(Joi)())
                })
            }
        }
    },{
        method: 'GET',
        path: '/users',
        options: {
            tags: ['api', 'users'],
            description: 'Get User by query',
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            schema: Joi.array().items(UserModel)
                        },
                        400: {
                            schema: Error400
                        }
                    }
                }
            },
            handler: async (req: Request, h: ResponseToolkit) => {
                const query: any = req.query;
                try {
                    const data = await User.find(query).populate("hobbies");
                    return data.map(doc => doc.toJSON());
                } catch (e) {
                    return h.response(e).code(e.statusCode || 500);
                }
            },
            validate: {
                query: Joi.object({
                    name: Joi.string()
                })
            }
        }
    },{
        method: 'GET',
        path: '/users/{id}',
        options: {
            tags: ['api', 'users'],
            description: 'Get User by id',
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            schema: UserModel
                        },
                        400: {
                            schema: Error400
                        },
                        404: {
                            schema: Error400
                        }
                    }
                }
            },
            handler: async (req: Request, h: ResponseToolkit) => {
                const { id } = req.params;
                try {
                    const data = await User.findOne({ _id: new mongoose.Types.ObjectId(id) }).populate("hobbies");
                    if (data) {
                        return data.toJSON();
                    } else {
                        return h.response({
                            statusCode: 404,
                            error: '404 Not Found',
                            message: 'User not found'
                        }).code(404);
                    }
                } catch (e) {
                    return h.response(e).code(e.statusCode || 500);
                }
            },
            validate: {
                params: Joi.object({
                    id: Joi.string()
                })
            }
        }
    },{
        method: 'PATCH',
        path: '/users/{id}',
        options: {
            tags: ['api', 'users'],
            description: 'Update User data by id',
            plugins: {
                'hapi-swagger': {
                    payloadType: 'form',
                    responses: {
                        200: {
                            schema: UserModel
                        },
                        400: {
                            schema: Error400
                        }
                    }
                }
            },
            handler: async (req: Request, h: ResponseToolkit) => {
                const { id } = req.params;
                const payload: any = req.payload;

                try {
                    const data = await User.findOneAndUpdate(
                        { _id: new mongoose.Types.ObjectId(id) }, 
                        { $set: payload },
                        { new: true }
                    );
                    return data ? data.toJSON() : {};
                } catch (e) {
                    return h.response(e).code(e.statusCode || 500);
                }
            },
            validate: {
                params: Joi.object({
                    id: Joi.string()
                }),
                payload: Joi.object({
                    name: Joi.string(),
                    hobbies: Joi.array().items(require('joi-objectid')(Joi)())
                })
            }
        }
    },{
        method: 'DELETE',
        path: '/users/{id}',
        options: {
            tags: ['api', 'users'],
            description: 'Delete User by id',
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            schema: Joi.object({
                                deletedCount: Joi.number()
                            })
                        }
                    }
                }
            },
            handler: async (req: Request, h: ResponseToolkit) => {
                const { id } = req.params;
                try {
                    return User.deleteOne({ _id: new mongoose.Types.ObjectId(id) });
                } catch (e) {
                    return h.response(e).code(e.statusCode || 500);
                }
            },
            validate: {
                params: Joi.object({
                    id: Joi.string()
                })
            }
        }
    }];
};
