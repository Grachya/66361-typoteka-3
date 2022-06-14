"use strict";
const {getLogger} = require(`../lib/logger`);
const logger = getLogger({name: `api`});

class SearchService {
  constructor(articles) {
    this._articles = articles;
  }

  findAll(serchText) {
    logger.error(`serchText: ${serchText}`);
    return this._articles.filter((article) => article.title.indexOf(serchText) > -1);
  }
}

module.exports = SearchService;
