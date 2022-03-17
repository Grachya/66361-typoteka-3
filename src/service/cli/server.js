"use strict";

const express = require(`express`);
const chalk = require(`chalk`);
const DEFAULT_PORT = 3000;
const API_PREFIX = `/api`;
const {HttpCode} = require(`./httpCode`);
const postsRoutes = require(`../routes/posts-routes`);
const routes = require(`../api`);

const app = express();
app.use(express.json());

app.use(API_PREFIX, routes);

app.use(`/posts`, postsRoutes);

app.use((req, res) => res.status(HttpCode.NOT_FOUND).send(`Not found`));

module.exports = {
  name: `--server`,
  run(args) {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    app
      .listen(port)
      .on(`listening`, () => {
        console.info(chalk.green(`Ожидаю соединений на ${port}`));
      })
      .on(`error`, ({message}) => {
        console.error(chalk.red(`Ошибка при создании сервера: ${message}`));
      });
  },
};
