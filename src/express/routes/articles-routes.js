'use strict';

const {Router} = require(`express`);
const articlesRoutes = new Router();

articlesRoutes.get(`/category/:id`, (req, res) => res.render(`articles-by-category`, {nobackground: false}));
articlesRoutes.get(`/add`, (req, res) => res.render(`post`, {nobackground: false}));
articlesRoutes.get(`/edit/:id`, (req, res) => res.render(`post`, {nobackground: false}));
articlesRoutes.get(`/:id`, (req, res) => res.render(`post-detail`, {nobackground: false}));

module.exports = articlesRoutes;
