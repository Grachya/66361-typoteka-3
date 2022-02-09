'use strict';

const {Router} = require(`express`);
const mainRoutes = new Router();

mainRoutes.get(`/`, (req, res) => res.render(`main`, {nobackground: false}));
mainRoutes.get(`/register`, (req, res) => res.render(`sign-up`, {nobackground: false}));
mainRoutes.get(`/login`, (req, res) => res.render(`login`, {nobackground: false}));
mainRoutes.get(`/search`, (req, res) => res.render(`search/search1`, {color: true}));

module.exports = mainRoutes;
