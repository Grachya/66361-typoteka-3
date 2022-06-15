"use strict";

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);

const route = new Router();

module.exports = (app, service) => {
  app.use(`/categories`, route);

  route.get(`/`, async (req, res) => {
    const {withCount} = req.query;
    const categories = await service.findAll(withCount);
    res.status(HttpCode.OK)
      .json(categories);
  });
};
