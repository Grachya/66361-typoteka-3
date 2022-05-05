"use strict";
const {getRandomInt} = require(`../../utils`);
const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const {shuffle} = require(`../../utils`);

const DEFAULT_COUNT = 1;
const FILE_NAME = `db/fill-db.sql`;
const MOCK_COUNT_RESTRICT = 1000;
const MAX_MOUNTH_DIFF = 3;
const MAX_COMMENTS = 4;
const MAX_ANNOUNCE_LENGTH = 250;
const MAX_FULLTEXT_LENGTH = 1000;

const FILE_ANNOUNCES_PATH = `./data/announces.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_COMMENTS_PATH = `./data/comments.txt`;
const FILE_PHOTOS_PATH = `./data/photos.txt`;

const roles = [`Guest`, `Reader`, `Author`];
const getRoleId = (roleName) => {
  const roleIndex = roles.findIndex((role) => role === roleName) || 0;
  return roleIndex + 1;
};

const users = [
  {
    email: `ivanov@example.com`,
    passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
    firstName: `Иван`,
    lastName: `Иванов`,
    avatar: `avatar-1.png`,
    roleId: getRoleId(`Reader`),
  },
  {
    email: `petrov@example.com`,
    passwordHash: `5f4dcc3b5aa765d61d8327deb882cf88`,
    firstName: `Пётр`,
    lastName: `Петров`,
    avatar: `avatar-2.png`,
    roleId: getRoleId(`Author`),
  },
];

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

const getRandomCategoriesId = (arr) => {
  return [...arr].map((_, index) => index + 1).slice(getRandomInt(0, arr.length - 1));
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
    .join(` `)
    .substring(0, MAX_ANNOUNCE_LENGTH);
};

const getFullText = (announces) => {
  const randomCount = getRandomInt(1, announces.length - 1);
  return Array(randomCount)
    .fill(``)
    .map(() => getRandFromArr(announces))
    .join(` `)
    .substring(0, MAX_FULLTEXT_LENGTH);
};

const getAuthorId = () => users.findIndex((user) => user.roleId === getRoleId(`Author`)) + 1;

const generateComments = (count, comments, userCount, articleId) => (
  Array(count).fill({}).map(() => ({
    articleId,
    userId: getRandomInt(1, userCount),
    text: shuffle(comments)
      .slice(0, getRandomInt(1, 3))
      .join(` `),
    createdDate: getDate(),
  }))
);

const generateArticles = (count, titles, categories, announces, commentsList, photoList, userCount) =>
  Array(count)
    .fill({})
    .map((item, index) => ({
      title: getRandFromArr(titles),
      createdDate: getDate(),
      announce: getAnnounce(announces),
      fullText: getFullText(announces),
      categories: getRandomCategoriesId(categories),
      comments: generateComments(getRandomInt(1, MAX_COMMENTS), commentsList, userCount, index + 1),
      photo: getRandFromArr(photoList),
      userId: getAuthorId(),
    }));

const disableAllTableTrigger = (tableName, isDisabled = true) => {
  return `ALTER TABLE ${tableName} ${isDisabled ? `DISABLE` : `ENABLE`} TRIGGER ALL;`;
};

module.exports = {
  name: `--fill`,
  async run(args) {
    const titles = await readContent(FILE_TITLES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);
    const announces = await readContent(FILE_ANNOUNCES_PATH);
    const commentsList = await readContent(FILE_COMMENTS_PATH);
    const photoList = await readContent(FILE_PHOTOS_PATH);

    const [count] = args;
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;
    if (countOffer > MOCK_COUNT_RESTRICT) {
      console.info(`Не больше 1000 объявлений`);
      return;
    }

    const articles = generateArticles(countOffer, titles, categories, announces, commentsList, photoList, users.length);

    const articleValues = articles.map(
        ({title, announce, fullText, photo, userId}) =>
          `('${title}', '${announce}', '${fullText}', '${photo}', ${userId})`
    ).join(`,\n`);

    const comments = articles.flatMap((article) => article.comments);
    const articlesCategories = articles.map((article, index) => ({articleId: index + 1, categoriesId: article.categories}));

    const roleValues = roles.map((role) => `('${role}')`).join(`,\n`);

    const userValues = users
      .map(
          ({email, passwordHash, firstName, lastName, avatar, roleId}) =>
            `('${email}', '${passwordHash}', '${firstName}', '${lastName}', '${avatar}', ${roleId})`
      )
      .join(`,\n`);

    const categoryValues = categories.map((name) => `('${name}')`).join(`,\n`);

    const commentValues = comments.map(
        ({userId, articleId, text}) =>
          `(${userId}, ${articleId}, '${text}')`
    ).join(`,\n`);

    const articleCategoryValues = articlesCategories.map(
        ({articleId, categoriesId}) => {
          return categoriesId.map((categoryId) => `(${articleId}, ${categoryId})`).join(`,\n`);
        }
    );

    const content = `-- Добавление ролей
INSERT INTO roles(name) VALUES
${roleValues};

-- Добавление пользователей
${disableAllTableTrigger(`users`)}
INSERT INTO users(email, password_hash, first_name, last_name, avatar, role_id) VALUES
${userValues};
${disableAllTableTrigger(`users`, false)}

-- Добавление категорий
INSERT INTO categories(name) VALUES
${categoryValues};

-- Добавление публикаций
${disableAllTableTrigger(`articles`)}
INSERT INTO articles(title, announce, fullText, picture, user_id) VALUES
${articleValues};
${disableAllTableTrigger(`articles`, false)}

-- Добавление комментариев
${disableAllTableTrigger(`comments`)}
INSERT INTO comments(user_id, article_id, text) VALUES
${commentValues};
${disableAllTableTrigger(`comments`, false)}

-- Добавление связи между публикациями и категориями
${disableAllTableTrigger(`articles_categories`)}
INSERT INTO articles_categories(article_id, category_id) VALUES
${articleCategoryValues};
${disableAllTableTrigger(`articles_categories`, false)}
`;

    try {
      await fs.writeFile(FILE_NAME, content);
      console.info(chalk.green(`Operation success. File created.`));
    } catch (err) {
      console.error(chalk.red(`Can't write data to file...`));
    }
  },
};
