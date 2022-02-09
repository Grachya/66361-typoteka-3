"use strict";

const express = require(`express`);
const path = require(`path`);
const PUBLIC_DIR = `public`;
const app = express();

app.set(`views`, path.resolve(__dirname, `templates`));
app.set(`view engine`, `pug`);
app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));

const articlesRoutes = require(`./routes/articles-routes`);
const myRoutes = require(`./routes/my-routes`);
const mainRoutes = require(`./routes/main-routes`);

const DEFAULT_PORT = 8080;

app.use(`/articles`, articlesRoutes);
app.use(`/my`, myRoutes);
app.use(`/`, mainRoutes);

app.listen(DEFAULT_PORT, () => {
  console.log(`Server listen on port ${DEFAULT_PORT}`);
});
