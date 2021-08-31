"use strict";
const {getRandomInt} = require(`../../utils`);
const fs = require(`fs`).promises;
const chalk = require(`chalk`);

const DEFAULT_COUNT = 1;
const FILE_NAME = `mocks.json`;
const MOCK_COUNT_RESTRICT = 1000;
const MAX_MOUNTH_DIFF = 3;

const FILE_ANNOUNCES_PATH = `./data/announces.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;

const readContent = async (path) => {
  try {
    const content = await fs.readFile(path, `utf-8`);
    return content.trim().split(`\n`);
  } catch (err) {
    console.log(chalk.red(err));
    return [];
  }
};

const getRandFromArr = (arr) => arr[getRandomInt(0, arr.length - 1)];

const getDate = () => {
  const nowDate = new Date();
  const start = new Date(new Date().setMonth(nowDate.getMonth() - MAX_MOUNTH_DIFF));
  const end = new Date();
  const randomDate = new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
  return randomDate.toLocaleString();
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

const generateOffers = (count, titles, categories, announces) =>
  Array(count)
    .fill({})
    .map(() => ({
      title: getRandFromArr(titles),
      createdDate: getDate(),
      announce: getAnnounce(announces),
      fullText: getFullText(announces),
      category: getRandFromArr(categories),
    }));

module.exports = {
  name: `--generate`,
  async run(args) {
    const titles = await readContent(FILE_TITLES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);
    const announces = await readContent(FILE_ANNOUNCES_PATH);

    const [count] = args;
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;
    if (countOffer > MOCK_COUNT_RESTRICT) {
      console.info(`Не больше 1000 объявлений`);
      return;
    }

    const content = JSON.stringify(generateOffers(countOffer, titles, categories, announces));

    try {
      await fs.writeFile(FILE_NAME, content);
      console.info(chalk.green(`Operation success. File created.`));
    } catch (err) {
      console.error(chalk.red(`Can't write data to file...`));
    }
  },
};
