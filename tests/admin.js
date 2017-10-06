import httpStatus from "http-status";
import request from "supertest";
import app from "../server";
import config from "./config";

describe("Admin Authorization", () => {

    describe("GET /dev/need-admin", () => {
        it("should return UNAUTHORIZED error", (done) => {
            request(app)
                .get("/dev/need-admin")
                .set("Authorization", config.token)
                .expect(httpStatus.UNAUTHORIZED)
                .then(() => done())
                .catch(done);
        });
    });

    describe("GET /dev/need-admin", () => {
        it("should return OK", (done) => {
            request(app)
                .get("/dev/need-admin")
                .set("Authorization", config.token_admin)
                .expect(httpStatus.OK)
                .then(() => done())
                .catch(done);
        });
    });
});