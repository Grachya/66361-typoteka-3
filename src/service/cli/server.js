"use strict";

const express = require(`express`);
const chalk = require(`chalk`);
const DEFAULT_PORT = 3000;
const API_PREFIX = `/api`;
const {HttpCode} = require(`./httpCode`);
const postsRoutes = require(`../routes/posts-routes`);
const routes = require(`../api`);
const {getLogger} = require(`../../../lib/logger`);

const logger = getLogger({name: `api`});
const app = express();
app.use(express.json());

app.use((req, res, next) => {
  // logger.debug(`Request on route ${req.url}`);
  res.on(`finish`, () => {
    logger.info(`Response status code ${res.statusCode}`);
  });
  next();
});

app.use(API_PREFIX, routes);

app.use(`/posts`, postsRoutes);

app.use((req, res) => {
  res.status(HttpCode.NOT_FOUND).send(`Not found`);
  logger.error(`Route not found: ${req.url}`);
});

app.use((err, _req, _res, _next) => {
  logger.error(`An error occured on processing request: ${err.message}`);
});

module.exports = {
  name: `--server`,
  run(args) {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    try {
      app
      .listen(port)
      .on(`listening`, () => {
        return logger.info(`Listening to connections on http://localhost:${port}/`);
      })
      .on(`error`, ({message}) => {
        return logger.error(`An error occurred on server creation: ${message}`);
      });
    } catch (err) {
      logger.error(`An error occurred: ${err.message}`);
      process.exit(1);
    }
  },
};
