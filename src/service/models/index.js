"use strict";

const Alias = require(`./alias`);
const {Model} = require(`sequelize`);
const defineCategory = require(`./category`);
const defineComment = require(`./comment`);
const defineArticle = require(`./article`);

class ArticleCategory extends Model {}

const defineModels = (sequelize) => {
  const Category = defineCategory(sequelize);
  const Comment = defineComment(sequelize);
  const Article = defineArticle(sequelize);

  Article.hasMany(Comment, {
    as: Alias.COMMENTS, foreignKey: `articleId`, onDelete: `cascade`
  });
  Comment.belongsTo(Article, {foreignKey: `articleId`});

  ArticleCategory.init({}, {sequelize});
  Article.belongsToMany(Category, {through: `articleCategories`, as: Alias.CATEGORIES});
  Category.belongsToMany(Article, {through: `articleCategories`, as: Alias.ARTICLES});
  Category.hasMany(ArticleCategory, {as: Alias.ARTICLES_CATEGORIES});

  return {Category, Comment, Article, ArticleCategory};
};

module.exports = defineModels;
