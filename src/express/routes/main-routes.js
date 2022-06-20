"use strict";

const {Router} = require(`express`);
const mainRoutes = new Router();
const api = require(`../api`).getAPI();
const {HttpCode} = require(`../../constants`);

const ARTICLES_PER_PAGE = 8;

mainRoutes.get(`/`, async (req, res) => {
  let {page = 1} = req.query;
  page = Number(page);

  try {
    const [{count, articles}, categories] = await Promise.all([
      api.getArticles({
        needComments: true,
        offset: (page - 1) * ARTICLES_PER_PAGE,
        limit: ARTICLES_PER_PAGE
      }),
      api.getCategories({withCount: true})
    ]);

    const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);

    return res.render(`main`, {nobackground: false, articles, page, totalPages, categories});
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

    return res.render(`search`, {
      results,
      query,
    });
  } catch (error) {
    return res.render(`search`, {
      results: [],
      query,
    });
  }
});

module.exports = mainRoutes;
