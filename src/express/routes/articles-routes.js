"use strict";

const {Router} = require(`express`);
const articlesRoutes = new Router();
const api = require(`../api`).getAPI();
const {HttpCode} = require(`../../constants`);
const multer = require(`multer`);
const path = require(`path`);
const {nanoid} = require(`nanoid`);

const UPLOAD_DIR = `../upload/img/`;

const upload = multer({
  storage: multer.diskStorage({
    destination: path.resolve(__dirname, UPLOAD_DIR),
    filename: (req, file, cb) => {
      const uniqueName = nanoid(10);
      const extension = path.extname(file);
      cb(null, `${uniqueName}${extension}`);
    }
  })
});

articlesRoutes.get(`/category/:id`, (req, res) =>
  res.render(`articles-by-category`, {nobackground: false})
);

articlesRoutes.get(`/add`, async (req, res) => {
  const categories = await api.getCategories();
  return res.render(`post-new`, {nobackground: false, categories});
});

articlesRoutes.post(`/add`, upload.single(`upload`), async (req, res) => {
  const {body, file} = req;

  const newArticle = {
    title: body.title,
    photo: file ? file.filename : ``,
    categories: body.categories,
    announce: body.announce,
    fullText: body.fulltext,
    createdDate: body.date,
  };

  try {
    await api.createArticle(newArticle);
    res.redirect(`/my`);
  } catch (_err) {
    res.redirect(`back`);
  }
});

articlesRoutes.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  try {
    const [article, categories] = await Promise.all([
      api.getArticle(id),
      api.getCategories(),
    ]);
    res.render(`post-edit`, {nobackground: false, article, categories});
  } catch (error) {
    res.status(HttpCode.NOT_FOUND).send(error.message);
  }
});

articlesRoutes.get(`/:id`, async (req, res) => {
  const {id} = req.params;
  try {
    const article = await api.getArticle(id);
    return res.render(`post-detail`, {nobackground: false, article});
  } catch (error) {
    return res.status(HttpCode.NOT_FOUND).send(error.message);
  }
});

module.exports = articlesRoutes;
