import { ResponseToolkit, Request } from '@hapi/hapi';
import Joi from 'joi';
import mongoose from 'mongoose';
import { Error400, HobbyModel } from '../resources';
import Hobby from "../models/hobbies";

export const hobbyController = (): any => {
    return [{
        method: 'POST',
        path: '/hobbies',
        options: {
            tags: ['api', 'hobbies'],
            description: 'Create new Hobby document',
            plugins: {
                'hapi-swagger': {
                    payloadType: 'form',
                    responses: {
                        200: {
                            schema: HobbyModel
                        },
                        400: {
                            schema: Error400
                        }
                    }
                }
            },
            handler: async (req: Request, h: ResponseToolkit) => {
                try {
                    const data = await Hobby.create(req.payload);
                    return data.toJSON();
                } catch (e) {
                    return h.response(e).code(e.statusCode || 500);
                }
            },
            validate: {
                payload: Joi.object({
                    passionLevel: Joi.string().valid('Low', 'Medium', 'High', 'Very-High').required(),
                    name: Joi.string().required(),
                    year: Joi.number().required()
                }),
            }
        }
    },{
        method: 'GET',
        path: '/hobbies',
        options: {
            tags: ['api', 'hobbies'],
            description: 'Get Hobby by query',
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            schema: Joi.array().items(HobbyModel)
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
                    const data = await Hobby.find(query);
                    return data.map(doc => doc.toJSON());
                } catch (e) {
                    return h.response(e).code(e.statusCode || 500);
                }
            },
            validate: {
                query: Joi.object({
                    passionLevel: Joi.string(),
                    name: Joi.string(),
                    year: Joi.number()
                })
            }
        }
    },{
        method: 'GET',
        path: '/hobbies/{id}',
        options: {
            tags: ['api', 'hobbies'],
            description: 'Get Hobby by id',
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            schema: HobbyModel
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
                    const data = await Hobby.findOne({ _id: new mongoose.Types.ObjectId(id) });
                    if (data) {
                        return data.toJSON();
                    } else {
                        return h.response({
                            statusCode: 404,
                            error: '404 Not Found',
                            message: 'Hobby not found'
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
        path: '/hobbies/{id}',
        options: {
            tags: ['api', 'hobbies'],
            description: 'Update Hobby data by id',
            plugins: {
                'hapi-swagger': {
                    payloadType: 'form',
                    responses: {
                        200: {
                            schema: HobbyModel
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
                    const data = await Hobby.findOneAndUpdate(
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
                    passionLevel: Joi.string().valid('Low', 'Medium', 'High', 'Very-High'),
                    name: Joi.string(),
                    year: Joi.number()
                })
            }
        }
    },{
        method: 'DELETE',
        path: '/hobbies/{id}',
        options: {
            tags: ['api', 'hobbies'],
            description: 'Delete Hobby by id',
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
                    return Hobby.deleteOne({ _id: new mongoose.Types.ObjectId(id) });
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
