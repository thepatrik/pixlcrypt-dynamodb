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
    it("200", done => {
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
            console.log(err);
            expect(token).to.not.be.empty;
        });
    });
});
