"use strict";

const {Router} = require(`express`);
const fs = require(`fs`).promises;
const postsRoutes = new Router();
const FILENAME = `mocks.json`;

postsRoutes.get(`/`, async (req, res) => {
  try {
    const fileContent = await fs.readFile(FILENAME);
    const mocks = JSON.parse(fileContent);
    res.json(mocks);
  } catch (_err) {
    res.send([]);
  }
});

module.exports = postsRoutes;
