import { Server } from "@hapi/hapi";
import { expect } from "chai";
import { describe, it, before, after } from "mocha";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from 'mongoose';
import { init } from "../../src/server";

describe("HobbyController", () => {
    let server: Server;
    let mongoServer: MongoMemoryServer;

    before(async () => {
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        await mongoose.connect(mongoUri);
        server = await init();
    });
      
    after(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
        await server.stop();
    });

    let docId: string;
    const mockHobby = {
        passionLevel: "High",
        name: "swimming",
        year: 2010
    };

    describe('POST /hobbies', () => {
        it("should successfully create a new document", async () => {
            const res: any = await server.inject({
                method: "POST",
                url: "/hobbies",
                payload: mockHobby
            });

            docId = res.result.id;
            expect(res.result).to.include(mockHobby);
        });
    });

    describe('GET /hobbies', () => {
        it("should successfully get documents", async () => {
            const res: any = await server.inject({
                method: "GET",
                url: "/hobbies"
            });

            expect(res.result).to.be.an("array");
            expect(res.result.length).to.equal(1);
        });
    });

    describe('GET /hobbies/:id', () => {
        it("should successfully get 1 document by id", async () => {
            const res: any = await server.inject({
                method: "GET",
                url: `/hobbies/${docId}`
            });

            expect(res.result).to.include(mockHobby);
        });
    });

    describe('PATCH /hobbies/:id', () => {
        it("should successfully update document", async () => {
            const res: any = await server.inject({
                method: "PATCH",
                url: `/hobbies/${docId}`,
                payload: {
                    name: "dancing"
                }
            });

            expect(res.result.name).to.equal("dancing");
        });
    });

    describe('DELETE /hobbies/:id', () => {
        it("should successfully delete document", async () => {
            const res: any = await server.inject({
                method: "DELETE",
                url: `/hobbies/${docId}`
            });

            expect(res.result.deletedCount).to.equal(1);
        });
    });
});