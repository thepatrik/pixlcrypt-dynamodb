"use strict";
const app = require("./app");
const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log("Node app is running on port", port);
    console.log("Environment is", process.env.NODE_ENV);
});

module.exports = app;
