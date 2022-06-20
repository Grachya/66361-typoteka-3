"use strict";

const axios = require(`axios`);

const TIMEOUT = 1000;
const port = process.env.API_PORT || 3000;
const defaultUrl = `http://localhost:${port}/api/`;

class API {
  constructor(baseURL, timeout) {
    this._http = axios.create({
      baseURL,
      timeout,
    });
  }

  async _load(url, options) {
    const response = await this._http.request({url, ...options});
    return response.data;
  }

  getArticles({offset, limit, needComments}) {
    return this._load(`/articles`, {params: {offset, limit, needComments}});
  }

  getArticle(id, {needComments} = {}) {
    return this._load(`/articles/${id}`, {params: {needComments}});
  }

  search(query) {
    return this._load(`/search`, {params: {query}});
  }

  async getCategories({withCount} = {}) {
    return await this._load(`/categories`, {params: {withCount}});
  }

  async createArticle(data) {
    return await this._load(`/articles/`, {
      method: `POST`,
      data,
    });
  }
}

const defaultAPI = new API(defaultUrl, TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI,
};
