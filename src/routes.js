const express = require("express");
const router = express.Router();
const graphqlHTTP = require("express-graphql");
const healthController = require("./healthController");
const schema = require("./schema");
const resolvers = require("./resolvers");
const jwt = require("express-jwt");
const awsHelper = require("./awsHelper");
const config = require("./config");
const bucket = config.aws.authKeys.public.bucket;
const key = config.aws.authKeys.public.key;
let publicKey;

const jwtCheck = jwt({
    credentialsRequired: false,
    secret: (req, payload, done) => {
        if (publicKey) {
            done(null, publicKey);
        }
        awsHelper.getS3Obj(bucket, key).then(key => {
            publicKey = key;
            done(null, publicKey);
        });
    }
});

router.use("/graphql", jwtCheck, graphqlHTTP({
    schema: schema.getSchema(),
    rootValue: resolvers.getRoot(),
    graphiql: true
}));

router.use("/health",  healthController);

module.exports = router;
