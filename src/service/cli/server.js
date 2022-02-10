"use strict";

const express = require(`express`);
const chalk = require(`chalk`);
const DEFAULT_PORT = 3000;
const {HttpCode} = require(`./httpCode`);
const postsRoutes = require(`./routes/posts-routes`);

const app = express();
app.use(express.json());

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
