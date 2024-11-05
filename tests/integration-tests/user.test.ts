// @ts-ignore
import supertest from "supertest";
import {app} from "../../src";
import {TestUtil} from "./test-util";

describe("POST /api/users/register", () => {
    afterEach(async () => {
        await TestUtil.deleteUsers();
    });

    it("Should can register a new users", async () => {
        const res = await supertest(app)
            .post("/api/users/register")
            .send({
                nik: "1267386729476297",
                name: "test",
                email: "test@test.com",
                password: "123"
            });

        expect(res.status).toBe(201);
        expect(res.body.data).toBeDefined();
    });

    it("Should fail to register (422)", async () => {
        const res = await supertest(app)
            .post("/api/users/register")
            .send({
                nik: "",
                name: "test",
                email: "test@testcom",
                password: "123"
            });

        expect(res.status).toBe(422);
        expect(res.body.errors).toBeDefined();
    });
});

describe("POST /api/users/login", () => {
    beforeEach(async () => {
        await TestUtil.createUser();
    });

    afterEach(async () => {
        await TestUtil.deleteUsers();
    });

    it("Should can login", async () => {
       const res = await supertest(app)
            .post("/api/users/login")
            .send({
                email: "test@test.com",
                password: "123"
            });

        expect(res.status).toBe(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.data.token).toBeDefined();
    });

    it("Should fail to login (401)", async () => {
        const res = await supertest(app)
            .post("/api/users/login")
            .send({
                email: "test@test.com",
                password: "salah"
            });

        expect(res.status).toBe(401);
        expect(res.body.errors).toBeDefined();
    });

    it("Should fail to login (422)", async () => {
        const res = await supertest(app)
            .post("/api/users/login")
            .send({
                email: "test@testcom",
                password: "123"
            });

        expect(res.status).toBe(422);
        expect(res.body.errors).toBeDefined();
    });
});