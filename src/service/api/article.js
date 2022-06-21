"use strict";

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const articleValidator = require(`../middlewares/articleValidator`);
const articleExists = require(`../middlewares/articleExists`);

module.exports = (app, articleService, commentService) => {
  const route = new Router();

  app.use(`/articles`, route);

  route.get(`/`, async (req, res) => {
    const {limit, offset, needComments} = req.query;
    let result;
    if (limit || offset) {
      result = await articleService.findPage({limit, offset, needComments});
    } else {
      result = await articleService.findAll(needComments);
    }
    return res.status(HttpCode.OK).json(result);
  });

  route.post(`/`, articleValidator, async (req, res) => {
    const article = await articleService.create(req.body);

    return res.status(HttpCode.CREATED).json(article);
  });

  route.get(`/:articleId`, async (req, res) => {
    const {articleId} = req.params;
    const {needComments} = req.query;
    const article = await articleService.findOne(articleId, needComments);

    if (!article) {
      return res.status(HttpCode.NOT_FOUND).send(`Not found with ${articleId}`);
    }

    return res.status(HttpCode.OK).json(article);
  });

  route.put(`/:articleId`, [articleValidator, articleExists(articleService)], async (req, res) => {
    const {articleId} = req.params;
    const article = req.body;
    const updatedArticle = await articleService.update(articleId, article);

    if (!updatedArticle) {
      return res.status(HttpCode.NOT_FOUND).send(`Not updated with ${articleId}`);
    }

    return res.status(HttpCode.OK).json(updatedArticle);
  });

  route.delete(`/:articleId`, articleExists(articleService), async (req, res) => {
    const {articleId} = req.params;
    const deletedArticle = await articleService.delete(articleId);

    if (!deletedArticle) {
      return res.status(HttpCode.NOT_FOUND).send(`Not found article with ${articleId}`);
    }

    return res.status(HttpCode.OK).json(deletedArticle);
  });

  route.get(`/:articleId/comments`, articleExists(articleService), async (req, res) => {
    const {article} = res.locals;
    const comments = await commentService.findAll(article.id);
    return res.status(HttpCode.OK).json(comments);
  });

  route.post(`/:articleId/comments`, articleExists(articleService), async (req, res) => {
    const {article} = res.locals;
    const {comment} = req.body;

    const newComment = await commentService.create(article.id, comment);
    res.status(HttpCode.CREATED).json(newComment);
  });

  route.delete(`/:articleId/comments/:commentId`, articleExists(articleService), async (req, res) => {
    const {commentId} = req.params;

    const deletedComment = await commentService.delete(commentId);

    if (!deletedComment) {
      return res.status(HttpCode.NOT_FOUND).send(`Not found`);
    }

    return res.status(HttpCode.OK).json(deletedComment);
  });
};
