import httpStatus from "http-status";
import request from "supertest";
import { expect } from "chai";
import app from "../server";
import config from "./config";

describe("Create User/Profile", () => {
    var profile = {};

    describe("POST /auth/signup to signup new user", () => {
        it("should created a new user", (done) => {
            request(app)
                .post("/auth/signup")
                .send(config.user)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.message).to.equal("authenticated");
                    expect(res.body.token).to.be.an("string");
                    expect(res.body.user.id).to.equal(config.user.username);
                    expect(res.body.user.email).to.equal(config.user.email);
                    expect(res.body.user.role).to.equal("user");
                    expect(res.body.user.createdAt).to.be.an("string");
                    expect(res.body.user.updatedAt).to.be.an("string");
                    config.user = res.body.user;
                    profile.id = res.body.user.id;
                    done();
                })
                .catch(done);
        });

        it("should report BAD_REQUEST because of too short password < 6 characters", (done) => {
            request(app)
                .post("/auth/signup")
                .send({
                    username: "oneuser",
                    password: "shrt",
                    email: "mail@foo.bar"
                })
                .expect(httpStatus.BAD_REQUEST)
                .then(res => {
                    expect(res.body.type).to.equal("APIError");
                    done();
                })
                .catch(done);
        });

        it("should report UNAUTHORIZED because username already taken", (done) => {
            request(app)
                .post("/auth/signup")
                .send({
                    username: config.user.username,
                    password: "onepassword",
                    email: "mail@foo.bar"
                })
                .expect(httpStatus.UNAUTHORIZED)
                .then(res => {
                    expect(res.body.type).to.equal("APIError");
                    done();
                })
                .catch(done);
        });
    });

    describe("POST /auth/login to login", () => {
        it("should log user", (done) => {
            request(app)
                .post("/auth/login")
                .send({
                    username: "jeanpierre",
                    password: "testpass"
                })
                .expect(httpStatus.OK)
                .then(res => {
                    expect(res.body.message).to.equal("authenticated");
                    expect(res.body.token).to.be.an("string");
                    expect(res.body.user.id).to.equal(config.user.username);
                    expect(res.body.user.email).to.equal(config.user.email);
                    expect(res.body.user.role).to.equal("user");
                    expect(res.body.user.createdAt).to.be.an("string");
                    expect(res.body.user.updatedAt).to.be.an("string");
                    config.token = res.body.token;
                    done();
                })
                .catch(done);
        });

        it("should log the root", (done) => {
            request(app)
                .post("/auth/login")
                .send({
                    username: "root",
                    password: "root"
                })
                .expect(httpStatus.OK)
                .then(res => {
                    expect(res.body.message).to.equal("authenticated");
                    expect(res.body.token).to.be.an("string");
                    config.token_admin = res.body.token;
                    done();
                })
                .catch(done);
        });

        it("should report UNAUTHORIZED because of wrong password", (done) => {
            request(app)
                .post("/auth/login")
                .send({
                    username: "jeanpierre",
                    password: "bulllshit"
                })
                .expect(httpStatus.UNAUTHORIZED)
                .then(() => done())
                .catch(done);
        });
    });

    describe("GET /users/:userId w/ bad token", () => {
        it("should report error UNAUTHORIZED because user does not exist", done => {
            request(app)
                .get(`/users/${config.user.id}`)
                .set("Authorization", config.tokenUserNotExist)
                .expect(httpStatus.UNAUTHORIZED)
                .then(() => {
                    done();
                })
                .catch(done);
        });
    });

    describe("GET /users/:userId", () => {
        it("should get user details", (done) => {
            request(app)
                .get(`/users/${config.user.id}`)
                .set("Authorization", config.token)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.id).to.equal(config.user.id);
                    expect(res.body.email).to.equal(config.user.email);
                    expect(res.body.createdAt).to.be.an("string");
                    expect(res.body.updatedAt).to.be.an("string");
                    done();
                })
                .catch(done);
        });

        it("should report error NOT_FOUND, when user does not exists", (done) => {
            request(app)
                .get("/users/toitexistepas")
                .set("Authorization", config.token)
                .expect(httpStatus.NOT_FOUND)
                .then(() => {
                    done();
                })
                .catch(done);
        });
    });

    describe("GET /profiles", () => {
        it("should be UNAUTHORIZED", (done) => {
            request(app)
                .get("/profiles")
                .set("Authorization", config.token)
                .expect(httpStatus.UNAUTHORIZED)
                .then(() => {
                    done();
                })
                .catch(done);
        });
    });

    describe("GET /profiles/:profileId", () => {
        it("should get profile details", (done) => {
            request(app)
                .get(`/profiles/${profile.id}`)
                .set("Authorization", config.token)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.id).to.equal(config.user.id);
                    expect(res.body.createdAt).to.be.an("string");
                    expect(res.body.updatedAt).to.be.an("string");
                    done();
                })
                .catch(done);
        });

        it("should report error NOT_FOUND, when profile does not exists", (done) => {
            request(app)
                .get("/profiles/toitexistepas")
                .set("Authorization", config.token)
                .expect(httpStatus.NOT_FOUND)
                .then(() => {
                    done();
                })
                .catch(done);
        });
    });

    describe("PUT /users/:userId", () => {
        it("should update user details", (done) => {
            request(app)
                .put(`/users/${config.user.id}`)
                .set("Authorization", config.token)
                .send({
                    email: "update@foo.bar"
                })
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.id).to.equal(config.user.id);
                    expect(res.body.email).to.equal("update@foo.bar");
                    config.user.email = res.body.email;
                    done();
                })
                .catch(done);
        });

        it("should update user password", (done) => {
            request(app)
                .put(`/users/${config.user.id}`)
                .set("Authorization", config.token)
                .send({
                    password: "anotherpass"
                })
                .expect(httpStatus.OK)
                .then(res => {
                    expect(res.body.id).to.equal(config.user.id);
                    done();
                })
                .catch(done);
        });
    });

    describe("POST /auth/login", () => {
        it("should login with new password", (done) => {
            request(app)
                .post("/auth/login")
                .send({
                    username: "jeanpierre",
                    password: "anotherpass"
                })
                .expect(httpStatus.OK)
                .then(res => {
                    expect(res.body.message).to.equal("authenticated");
                    expect(res.body.token).to.be.an("string");
                    expect(res.body.user.id).to.equal(config.user.id);
                    config.token = res.body.token;
                    done();
                })
                .catch(done);
        });
    });

    describe("PUT /profiles/:profileId", () => {
        it("should update profile details", (done) => {
            request(app)
                .put(`/profiles/${profile.id}`)
                .send({
                    description: "Super Caption",
                    website: "https://foo.bar",
                    location: "Paris, France",
                })
                .set("Authorization", config.token)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.id).to.equal(profile.id);
                    expect(res.body.description).to.equal("Super Caption");
                    expect(res.body.website).to.equal("https://foo.bar");
                    expect(res.body.location).to.equal("Paris, France");
                    done();
                })
                .catch(done);
        });
    });

    describe("GET /profiles", () => {
        it("should get list of profiles", (done) => {
            request(app)
                .get("/profiles")
                .set("Authorization", config.token)
                .expect(httpStatus.UNAUTHORIZED)
                .then(() => {
                    done();
                })
                .catch(done);
        });
    });

    describe("GET /profiles", () => {
        it("should get list of profiles", (done) => {
            request(app)
                .get("/profiles")
                .set("Authorization", config.token_admin)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body).to.be.an("array");
                    done();
                })
                .catch(done);
        });
    });

    describe("GET /profiles/search", () => {
        it("should search profiles", (done) => {
            request(app)
                .get("/profiles/search")
                .expect(httpStatus.OK)
                .query({
                    query: config.user.id
                })
                .set("Authorization", config.token)
                .then(res => {
                    expect(res.body).to.be.an("array");
                    done();
                })
                .catch(done);
        });
    });
});
