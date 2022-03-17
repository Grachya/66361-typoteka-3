"use strict";

const {Router} = require(`express`);
const route = new Router();
const {HttpCode} = require(`../../constants`);
const articleValidator = require(`../middlewares/articleValidator`);
const articleExists = require(`../middlewares/articleExists`);

module.exports = (app, articleService, commentService) => {
  app.use(`/articles`, route);

  route.get(`/`, (req, res) => {
    const allArticles = articleService.findAll();
    return res.status(HttpCode.OK).json(allArticles);
  });

  route.post(`/`, articleValidator, (req, res) => {
    const article = articleService.create(req.body);

    return res.status(HttpCode.CREATED).json(article);
  });

  route.get(`/:articleId`, (req, res) => {
    const {articleId} = req.params;
    const article = articleService.findOne(articleId);

    if (!article) {
      return res.status(HttpCode.NOT_FOUND).send(`Not found with ${articleId}`);
    }

    return res.status(HttpCode.OK).json(article);
  });

  route.put(`/:articleId`, async (req, res) => {
    const {articleId, article} = req.params;
    const updatedArticle = articleService.update(articleId, article);
    return res.status(HttpCode.OK).json(updatedArticle);
  });

  route.delete(`/:articleId`, async (req, res) => {
    const {articleId} = req.params;
    const deletedArticle = articleService.drop(articleId);
    return res.status(HttpCode.OK).json(deletedArticle);
  });

  route.get(`/:articleId/comments`, articleExists(articleService), (req, res) => {
    const {article} = res.locals;
    return res.status(HttpCode.OK).json(article.comments);
  });

  route.post(`/:articleId/comments`, articleExists(articleService), async (req, res) => {
    const {article} = res.locals;
    const {comment} = req.body;

    commentService.create(article.id, comment);
  });

  route.delete(`/:articleId/comments/:commentId`, articleExists(articleService), async (req, res) => {
    const {article} = res.locals;
    const {commentId} = req.params;

    const deletedComment = commentService.drop(article, commentId);
    return res.status(HttpCode.OK).json(deletedComment);
  });
};
