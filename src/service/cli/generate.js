"use strict";
const {getRandomInt} = require(`../../utils`);
const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const {shuffle} = require(`../../utils`);
const {nanoid} = require(`nanoid`);
const {MAX_ID_LENGTH} = require(`../../constants`);

const DEFAULT_COUNT = 1;
const FILE_NAME = `mocks.json`;
const MOCK_COUNT_RESTRICT = 1000;
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

const getRandomCategories = (arr) => {
  return [...arr].sort(() => Math.random() > 0).slice(getRandomInt(0, arr.length - 1));
};

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
    .map(() => getRandFromArr(announces))
    .join(` `);
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
    id: nanoid(MAX_ID_LENGTH),
    text: shuffle(comments)
      .slice(0, getRandomInt(1, 3))
      .join(` `),
    createdDate: getDate(),
  }))
);

const generateArticles = (count, titles, categories, announces, comments, photo) =>
  Array(count)
    .fill({})
    .map(() => ({
      id: nanoid(MAX_ID_LENGTH),
      title: getRandFromArr(titles),
      createdDate: getDate(),
      announce: getAnnounce(announces),
      fullText: getFullText(announces),
      categories: getRandomCategories(categories),
      comments: generateComments(getRandomInt(1, MAX_COMMENTS), comments),
      photo: getRandFromArr(photo),
    }));

module.exports = {
  name: `--generate`,
  async run(args) {
    const titles = await readContent(FILE_TITLES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);
    const announces = await readContent(FILE_ANNOUNCES_PATH);
    const comments = await readContent(FILE_COMMENTS_PATH);
    const photo = await readContent(FILE_PHOTOS_PATH);

    const [count] = args;
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;
    if (countOffer > MOCK_COUNT_RESTRICT) {
      console.info(`Не больше 1000 объявлений`);
      return;
    }

    const content = JSON.stringify(generateArticles(countOffer, titles, categories, announces, comments, photo));

    try {
      await fs.writeFile(FILE_NAME, content);
      console.info(chalk.green(`Operation success. File created.`));
    } catch (err) {
      console.error(chalk.red(`Can't write data to file...`));
    }
  },
};
