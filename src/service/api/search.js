"use strict";

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);

const route = new Router();

module.exports = (app, service) => {
  app.use(`/search`, route);

  route.get(`/`, async (req, res) => {
    const searchText = req.query.query;

    const searchArticles = await service.findAll(searchText);
    res.status(HttpCode.OK)
      .json(searchArticles);
  });
};
