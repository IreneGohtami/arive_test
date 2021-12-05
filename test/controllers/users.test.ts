import { Server } from "@hapi/hapi";
import { expect } from "chai";
import { describe, it, before, after } from "mocha";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from 'mongoose';
import { init } from "../../src/server";
import Hobby from "../../src/models/hobbies";

describe("UserController", () => {
    let server: Server;
    let mongoServer: MongoMemoryServer;
    let hobbyDocId: string;
    let userDocId: string;
    let mockUser: any;

    before(async () => {
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        await mongoose.connect(mongoUri);
        server = await init();

        // create at least 1 hobby
        const hobbyDoc = await Hobby.create({
            passionLevel: "High",
            name: "swimming",
            year: 2010
        })
        hobbyDocId = hobbyDoc.id;

        // create a user object
        mockUser = {
            name: "Mary Jane",
            hobbies: [hobbyDocId]
        };
    });
      
    after(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
        await server.stop();
    });

    describe('POST /users', () => {
        it("should successfully create a new document", async () => {
            const res: any = await server.inject({
                method: "POST",
                url: "/users",
                payload: mockUser
            });

            userDocId = res.result.id;
            expect(res.result.name).to.equal(mockUser.name);
        });
    });

    describe('GET /users', () => {
        it("should successfully get documents", async () => {
            const res: any = await server.inject({
                method: "GET",
                url: "/users"
            });

            expect(res.result).to.be.an("array");
            expect(res.result.length).to.equal(1);
        });
    });

    describe('GET /users/:id', () => {
        it("should successfully get 1 document by id", async () => {
            const res: any = await server.inject({
                method: "GET",
                url: `/users/${userDocId}`
            });

            expect(res.result.name).to.equal(mockUser.name);
        });
    });

    describe('PATCH /users/:id', () => {
        it("should successfully update document", async () => {
            const res: any = await server.inject({
                method: "PATCH",
                url: `/users/${userDocId}`,
                payload: {
                    name: "Mary Smith"
                }
            });

            expect(res.result.name).to.equal("Mary Smith");
        });
    });

    describe('DELETE /users/:id', () => {
        it("should successfully delete document", async () => {
            const res: any = await server.inject({
                method: "DELETE",
                url: `/users/${userDocId}`
            });

            expect(res.result.deletedCount).to.equal(1);
        });
    });
});