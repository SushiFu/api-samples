import httpStatus from "http-status";
import request from "supertest";
import { expect } from "chai";
import app from "../server";
import config from "./config";

describe("Feedbacks API", () => {

    var feedback = {
        message: "This is a feedback"
    };

    describe("POST /feedbacks", () => {
        it("should create a feedback", (done) => {
            request(app)
                .post("/feedbacks")
                .send(feedback)
                .set("Authorization", config.token)
                .expect(httpStatus.OK)
                .then(res => {
                    expect(res.body.message).to.equal(feedback.message);
                    expect(res.body.addedBy).to.equal(config.user.id);
                    expect(res.body.className).to.equal("feedback");
                    feedback = res.body;
                    done();
                })
                .catch(done);
        });
    });

    describe("GET /feedbacks/:feedbackId", () => {
        it("should get failed the previously created feedback", (done) => {
            request(app)
                .get(`/feedbacks/${feedback.id}`)
                .set("Authorization", config.token)
                .expect(httpStatus.UNAUTHORIZED)
                .then(() => {
                    done();
                })
                .catch(done);
        });

        it("should get the previously created feedback", (done) => {
            request(app)
                .get(`/feedbacks/${feedback.id}`)
                .set("Authorization", config.token_admin)
                .expect(httpStatus.OK)
                .then(res => {
                    expect(res.body.className).to.equal("feedback");
                    expect(res.body.addedBy.id).to.equal(config.user.id);
                    expect(res.body.message).to.equal(feedback.message);
                    done();
                })
                .catch(done);
        });
    });

    describe("PATCH /feedbacks/:feedbackId", () => {
        it("should update the feedback's message", (done) => {
            request(app)
                .patch(`/feedbacks/${feedback.id}`)
                .set("Authorization", config.token)
                .send({
                    message: "Best feedback EUW"
                })
                .expect(httpStatus.OK)
                .then(res => {
                    expect(res.body.message).to.equal("Best feedback EUW");
                    expect(res.body.id).to.equal(feedback.id);
                    expect(res.body.addedBy.id).to.equal(config.user.id);
                    feedback = res.body;
                    done();
                })
                .catch(done);
        });
    });

    describe("GET /feedbacks", () => {
        it("should get a list of feedbacks", (done) => {
            request(app)
                .get("/feedbacks")
                .set("Authorization", config.token_admin)
                .expect(httpStatus.OK)
                .then(res => {
                    expect(res.body).to.be.an("array");
                    expect(res.body).to.have.lengthOf(1);
                    res.body.forEach(feedback => {
                        expect(feedback.className).to.equal("feedback");
                    });
                    done();
                })
                .catch(done);
        });

        it("should fail getting the list of feedbacks", (done) => {
            request(app)
                .get("/feedbacks")
                .set("Authorization", config.token)
                .expect(httpStatus.UNAUTHORIZED)
                .then(() => {
                    done();
                })
                .catch(done);
        });
    });

    describe("DELETE /feedbacks", () => {
        it("should fail trying to delete the feedback", (done) => {
            request(app)
                .delete(`/feedbacks/${feedback.id}`)
                .set("Authorization", config.token)
                .expect(httpStatus.UNAUTHORIZED)
                .then(() => {
                    done();
                })
                .catch(done);
        });

        it("should delete the create feedback", (done) => {
            request(app)
                .delete(`/feedbacks/${feedback.id}`)
                .set("Authorization", config.token_admin)
                .expect(httpStatus.OK)
                .then(res => {
                    expect(res.body.id).to.equal(feedback.id);
                    expect(res.body.message).to.equal(feedback.message);
                    expect(res.body.className).to.equal("feedback");
                    done();
                })
                .catch(done);
        });
    });
});