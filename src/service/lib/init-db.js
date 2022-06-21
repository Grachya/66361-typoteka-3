'use strict';

const defineModels = require(`../models`);
const Alias = require(`../models/alias`);

module.exports = async (sequelize, {categories, articles}) => {
  const {Category, Article} = defineModels(sequelize);
  await sequelize.sync({force: true});

  const categoryModels = await Category.bulkCreate(
      categories.map((item) => ({name: item}))
  );
  const categoryIdByName = categoryModels.reduce((acc, next) => ({
    [next.name]: next.id,
    ...acc
  }), {});

  async function getArticlePromises(articlesArr) {
    const articlePromisesArr = [];
    for (const article of articlesArr) {
      const articleModel = await Article.create(article, {
        include: [Alias.COMMENTS]
      });
      await articleModel.addCategories(article.categories.map((name) => categoryIdByName[name]));
      articlePromisesArr.push(article);
    }
    return articlePromisesArr;
  }

  const articlePromises = await getArticlePromises(articles);

  await Promise.all(articlePromises);
};
