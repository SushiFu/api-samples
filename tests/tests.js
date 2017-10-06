import mongoose from "mongoose";
import chai from "chai";

import { ready } from "../server";

chai.config.includeStack = true;

before(done => {
    ready.then(done);
});

after(done => {
    // required because https://github.com/Automattic/mongoose/issues/1251#issuecomment-65793092
    mongoose.models = {};
    mongoose.modelSchemas = {};
    mongoose.connection.close();
    done();
});

import "./misc";
import "./create_user";
import "./admin";
import "./feedbacks";
import "./delete_user";
