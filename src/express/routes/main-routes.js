"use strict";

const {Router} = require(`express`);
const mainRoutes = new Router();
const api = require(`../api`).getAPI();
const {HttpCode} = require(`../../constants`);

mainRoutes.get(`/`, async (req, res) => {
  try {
    const [articles, categories] = await Promise.all([
      api.getArticles(),
      api.getCategories({withCount: true})
    ]);
    return res.render(`main`, {nobackground: false, articles, categories});
  } catch (error) {
    return res.status(HttpCode.NOT_FOUND).send(error.message);
  }
});

mainRoutes.get(`/register`, (req, res) =>
  res.render(`sign-up`, {nobackground: false})
);

mainRoutes.get(`/login`, (req, res) =>
  res.render(`login`, {nobackground: false})
);

mainRoutes.get(`/search`, async (req, res) => {
  const {query} = req.query;
  try {
    const results = await api.search(query);

    return res.render(`search/search1`, {
      results,
      query,
    });
  } catch (error) {
    return res.render(`search/search1`, {
      results: [],
      query,
    });
  }
});

module.exports = mainRoutes;
