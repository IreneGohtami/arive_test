'use strict';

import * as Hapi from '@hapi/hapi';
import { Server, ServerRoute } from '@hapi/hapi';
import Inert from '@hapi/inert';
import Vision from '@hapi/vision';
import HapiSwagger from 'hapi-swagger';
import { HOST, PORT } from './config';
import { hobbyController, userController } from './controllers';
import { connect } from './mongo';

export let server: Server;

export const init = async function(isTest: boolean): Promise<Server> {
    server = Hapi.server({
        port: PORT,
        host: HOST
    });

    // Connect to DB
    if (!isTest) {
        await connect();
    }

    // Setup swagger
    const swaggerOptions = {
        info: {
            title: 'User Hobbies API Doc'
        }
    };

    const plugins: Array<Hapi.ServerRegisterPluginObject<any>> = [
        {
            plugin: Inert
        },
        {
            plugin: Vision
        },
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ];
    
    await server.register(plugins);

    // Define routes
    await server.route([
        ...hobbyController(),
        ...userController()
    ] as Array<ServerRoute>);

    return server;
};

export const start = async function (): Promise<void> {
    console.log(`Listening on ${server.settings.host}:${server.settings.port}`);
    return server.start();
};

process.on('unhandledRejection', (err) => {
    console.error("unhandledRejection");
    console.error(err);
    process.exit(1);
});