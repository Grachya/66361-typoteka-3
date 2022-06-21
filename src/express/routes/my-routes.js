"use strict";

const {Router} = require(`express`);
const myRoutes = new Router();
const api = require(`../api`).getAPI();
const {HttpCode} = require(`../../constants`);

myRoutes.get(`/`, async (req, res) => {
  try {
    const articles = await api.getArticles();
    return res.render(`my`, {nobackground: true, articles});
  } catch (error) {
    return res.status(HttpCode.NOT_FOUND).send(error.message);
  }
});

myRoutes.get(`/comments`, async (req, res) => {
  try {
    const articles = await api.getArticles({needComments: true});
    return res.render(`comments`, {nobackground: true, articles});
  } catch (error) {
    return res.status(HttpCode.NOT_FOUND).send(error.message);
  }
});

myRoutes.get(`/categories`, async (req, res) => {
  try {
    const categories = await api.getCategories();
    res.render(`all-categories`, {nobackground: true, categories});
  } catch (error) {
    return res.status(HttpCode.NOT_FOUND).send(error.message);
  }
});

module.exports = myRoutes;
