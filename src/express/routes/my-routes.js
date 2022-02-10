'use strict';

const {Router} = require(`express`);
const myRoutes = new Router();

myRoutes.get(`/`, (req, res) => res.render(`my`, {nobackground: true}));
myRoutes.get(`/comments`, (req, res) => res.render(`comments`, {nobackground: true}));
myRoutes.get(`/categories`, (req, res) => res.render(`all-categories`, {nobackground: true}));

module.exports = myRoutes;
