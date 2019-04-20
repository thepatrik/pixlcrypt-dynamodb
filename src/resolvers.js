const AWS = require("aws-sdk");
const config = require("./config");
AWS.config.region = config.aws.region;
const dynamodb = new AWS.DynamoDB();
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

function getUserId(args, context) {
    if (context.user && context.user.email) {
        return context.user.email;
    }
    return args.email;
}

const root = {
    user: (args, context) => {
        const userId = getUserId(args, context);
        const params = {
            TableName: "users",
            Key: {
                "email": {
                    S: userId
                }
            },
        };

        return dynamodb.getItem(params).promise().then(res => {
            if (res.Item === undefined) return;

            let email = res.Item.email.S;
            let name = res.Item.name.S;
            return new User(email, name);
        }).catch(err => {
            console.log("Got err from dynamodb", err);
        });
    },
    items: (args, context) => {
        const userId = getUserId(args, context);
        const params = {
            TableName: "photos",
            IndexName: "userId-dateAdded-index",
            ExpressionAttributeValues: {
                ":userId": {
                    S: userId
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

module.exports.getRoot = () => {
    return root;
};
