# pixlcrypt-dynamodb
[![Build Status](https://travis-ci.org/thepatrik/pixlcrypt-dynamodb.svg?branch=master)](https://travis-ci.org/thepatrik/pixlcrypt-dynamodb)

pixlcrypt API based on express, graphql and dynamodb

## development

### .env

Create a .env file and add environment variables to it

* `PORT` server port
* `TEST_USER_USERNAME` Username used in tests.
* `TEST_USER_PASSWORD` Password used in tests.

### scripts

Install app dependencies

```bash
$ npm i
```

Run app with

```bash
$ make start
```

Run linter

```bash
$ make eslint
```

Run tests

```bash
$ make test
```
