"use strict";
const {getRandomInt, shuffle, getText} = require(`../../utils`);
const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const {logger} = require(`../lib/logger`);
const sequelize = require(`../lib/sequelize`);
const initDB = require(`../lib/init-db`);

const DEFAULT_COUNT = 1;
const MOCK_COUNT_RESTRICT = 1000;
const MAX_ANNOUNCE_LENGTH = 250;
const MAX_MOUNTH_DIFF = 3;
const MAX_COMMENTS = 4;

const FILE_ANNOUNCES_PATH = `./data/announces.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_COMMENTS_PATH = `./data/comments.txt`;
const FILE_PHOTOS_PATH = `./data/photos.txt`;

const readContent = async (path) => {
  try {
    const content = await fs.readFile(path, `utf-8`);
    return content.trim().split(`\n`);
  } catch (err) {
    console.log(chalk.red(err));
    return [];
  }
};

const getRandFromArr = (arr) => shuffle(arr)[getRandomInt(0, arr.length - 1)];

const getDate = () => {
  const nowDate = new Date();
  const start = new Date(new Date().setMonth(nowDate.getMonth() - MAX_MOUNTH_DIFF));
  const end = new Date();
  const randomDate = new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
  return randomDate.toISOString();
};

const getAnnounce = (announces) => {
  const MAX_ANNOUNCE_RESTRICT = 5;
  const MIN_ANNOUNCE_RESTRICT = 0;
  const randomTextCount = getRandomInt(
      MIN_ANNOUNCE_RESTRICT,
      MAX_ANNOUNCE_RESTRICT
  );
  return [...Array(randomTextCount)]
    .fill(``)
    .map(() => getRandFromArr(announces));
};

const getFullText = (announces) => {
  const randomCount = getRandomInt(1, announces.length - 1);
  return Array(randomCount)
    .fill(``)
    .map(() => getRandFromArr(announces))
    .join(` `);
};

const generateComments = (count, comments) => (
  Array(count).fill({}).map(() => ({
    text: shuffle(comments)
      .slice(0, getRandomInt(1, 3))
      .join(` `),
    createdDate: getDate(),
  }))
);

const getRandomSubarray = (items) => {
  items = items.slice();
  let count = getRandomInt(1, items.length - 1);
  const result = [];
  while (count--) {
    result.push(
        ...items.splice(
            getRandomInt(0, items.length - 1), 1
        )
    );
  }
  return result;
};


const generateArticles = (count, titles, categories, announces, comments, photo) =>
  Array(count)
    .fill({})
    .map(() => ({
      title: getRandFromArr(titles),
      createdDate: getDate(),
      announce: getText(getAnnounce(announces), MAX_ANNOUNCE_LENGTH),
      fullText: getFullText(announces),
      categories: getRandomSubarray(categories),
      comments: generateComments(getRandomInt(1, MAX_COMMENTS), comments),
      photo: getRandFromArr(photo),
    }));

module.exports = {
  name: `--filldb`,
  async run(args) {
    const [count] = args;
    const countArticle = Number.parseInt(count, 10) || DEFAULT_COUNT;
    if (countArticle > MOCK_COUNT_RESTRICT) {
      console.info(`Не больше 1000 объявлений`);
      return;
    }

    try {
      logger.info(`Trying to connect to database...`);
      await sequelize.authenticate();
    } catch (err) {
      logger.error(`An error occurred: ${err.message}`);
      process.exit(1);
    }
    logger.info(`Connection to database established`);

    const titles = await readContent(FILE_TITLES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);
    const announces = await readContent(FILE_ANNOUNCES_PATH);
    const comments = await readContent(FILE_COMMENTS_PATH);
    const photo = await readContent(FILE_PHOTOS_PATH);

    const articles = generateArticles(countArticle, titles, categories, announces, comments, photo);

    initDB(sequelize, {categories, articles});
  },
};
