const express = require("express");
const router = express.Router();
const graphqlHTTP = require("express-graphql");
const { buildSchema } = require("graphql");
const AWS = require("aws-sdk");
const config = require("./config");
AWS.config.region = config.aws.region;
const dynamodb = new AWS.DynamoDB();
const healthController = require("./healthController");

const schema = buildSchema(`
  type User {
    email: String!
    name: String!
  }
  type Item {
    id: String!
    src: String!
    caption: String!
    description: String!
    mime: String!
    contentType: String!
    dateAdded: String!
  }
  type Query {
    users(email: String!):[User]
    items(id: String!, userId: String!): [Item]
  }
`);

class User {
    constructor(email, name) {
        this.email = email;
        this.name = name;
    }
}

class Item {
    constructor(id, src, caption, description, mime, contentType, dateAdded) {
        this.id = id;
        this.src = src;
        this.caption = caption;
        this.description = description;
        this.mime = mime;
        this.contentType = contentType;
        this.dateAdded = dateAdded;
    }
}

const root = {
    users: data => {
        const params = {
            TableName: "users",
            Key: {
                "email": {
                    S: data.email
                }
            },
        };

        return dynamodb.getItem(params).promise().then(res => {
            if (res.Item === undefined) return;

            let email = res.Item.email.S;
            let name = res.Item.name.S;
            return [new User(email, name)];
        }).catch(err => {
            console.log("Got err from dynamodb", err);
        });
    },
    items: data => {
        const params = {
            TableName: "photos",
            IndexName: "userId-dateAdded-index",
            ExpressionAttributeValues: {
                ":userId": {
                    S: data.userId
                }
            },
            KeyConditionExpression: "userId = :userId",
        };

        return dynamodb.query(params).promise().then(res => {
            let items = [];
            res.Items.forEach(i => {
                let id = i.itemId.S;
                let src = "";
                let caption = "";
                let description = "";
                let mime = "";
                let contentType = "";
                let dateAdded = i.dateAdded.N;
                let item = new Item(id, src, caption, description, mime, contentType, dateAdded);
                items.push(item);
            });
            return items;
        }).catch(err => {
            console.log("Got err from dynamodb", err);
        });
    }
};

router.use("/graphiql", graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}));

router.use("/graphql", graphqlHTTP({
    schema: schema,
    rootValue: root
}));

router.use("/health",  healthController);

module.exports = router;
