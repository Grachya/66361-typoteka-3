"use strict";

const {HttpCode} = require(`../../constants`);

module.exports = (articleService) => async (req, res, next) => {
  const {articleId} = req.params;
  const article = await articleService.findOne(articleId);

  if (!article) {
    return res
      .status(HttpCode.NOT_FOUND)
      .send(`Article with ${articleId} not found`);
  }

  res.locals.article = article;
  return next();
};
