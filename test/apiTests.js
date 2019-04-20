"use strict";
/* jshint -W030 */
const expect = require("chai").expect;
const request = require("supertest");
const app = require("../src/index.js");
const awsHelper = require("../src/awsHelper");
const username = process.env.TEST_USER_USERNAME;
const password = process.env.TEST_USER_PASSWORD;
let token;

describe("HTTP GET /health", () => {
    it("200: ok", done => {
        request(app)
            .get("/health")
            .expect("Content-Type", "text/plain; charset=utf-8")
            .expect(200, done);
    });
});

describe("Fetch development access token", () => {
    it("Fetch token", done => {
        awsHelper.getToken(username, password).then(res => {
            token = res;
            expect(token).to.not.be.empty;
            done();
        }).catch(err => {
            done(err);
        });
    });
});

describe("HTTP POST /graphql query=user", () => {
    it("200: ok - fetch user", done => {
        request(app)
            .post("/graphql")
            .set("Authorization", "Bearer " + token)
            .send({query: `{
                user(email: "pixlcrypt@gmail.com") {
                    name
                    email
                }
            }`})
            .type("form")
            .expect(res => {
                expect(res.body.data.user).to.not.be.empty;})
            .expect(200, done);
    });
});

describe("HTTP POST /graphql query=items", () => {
    it("200: ok - fetch all items", done => {
        request(app)
            .post("/graphql")
            .set("Authorization", "Bearer " + token)
            .send({query: `{
                items(userId: "pixlcrypt@gmail.com") {
                    id
                }
            }`})
            .type("form")
            .expect(res => {
                expect(res.body.data.items.length).to.equal(1);})
            .expect(200, done);
    });
    it("200: ok - fetch specific item", done => {
        request(app)
            .post("/graphql")
            .set("Authorization", "Bearer " + token)
            .send({query: `{
                items(id: "hej", userId: "pixlcrypt@gmail.com") {
                    id
                }
            }`})
            .type("form")
            .expect(res => {
                expect(res.body.data.items.length).to.equal(1);})
            .expect(200, done);
    });
});
