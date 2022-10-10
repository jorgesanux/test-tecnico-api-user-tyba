import request from "supertest";

import app from "../src/app.js";
import User from "../src/model/user.model.js";

function removeUser(){
    User.destroy({
        where: {
            email: "test@test.com"
        }
    });
}

beforeAll(() => removeUser());
afterAll(() => removeUser());

describe("Test /auth", () => {
    describe("POST /auth/register", () => {
        test("Should create a test user", async () => {
            const res = await request(app)
                .post("/auth/register")
                .expect("Content-Type", /json/)
                .send({
                    "first_name": "test_name",
                    "last_name": "test_lastname",
                    "email": "test@test.com",
                    "password": "test"
                })
                .expect(201);

            expect(res.body.result).toBeDefined();
            expect(res.body.result.id).toBeDefined();
        })
    
        test("Shouldn't create a test user because already exists", async () => {
            await request(app)
                .post("/auth/register")
                .expect("Content-Type", /json/)
                .send({
                    "first_name": "test_name",
                    "last_name": "test_lastname",
                    "email": "test@test.com",
                    "password": "test"
                })
                .expect(500);
        })
    });

    describe("POST /auth/login", () => {
        test("Should generate a jwt", async () => {
            const res = await request(app)
                .post("/auth/login")
                .expect("Content-Type", /json/)
                .send({
                    "user":"test@test.com",
                    "password":"test"
                })
                .expect(200);
            
            expect(res.body.result).toBeDefined();
            expect(res.body.result.token).toBeDefined();
        })
    });
});