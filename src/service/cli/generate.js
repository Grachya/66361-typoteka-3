"use strict";
const {getRandomInt} = require(`../../utils`);
const fs = require(`fs`);

const DEFAULT_COUNT = 1;
const FILE_NAME = `mocks.json`;
const MOCK_COUNT_RESTRICT = 1000;
const MAX_MOUNTH_DIFF = 3;

const TITLES = [
  `Ёлки. История деревьев`,
  `Как перестать беспокоиться и начать жить`,
  `Как достигнуть успеха не вставая с кресла`,
  `Обзор новейшего смартфона`,
  `Лучшие рок-музыканты 20-века`,
  `Как начать программировать`,
  `Учим HTML и CSS`,
  `Что такое золотое сечение`,
  `Как собрать камни бесконечности`,
  `Борьба с прокрастинацией`,
  `Рок — это протест`,
  `Самый лучший музыкальный альбом этого года`,
];

const ANNOUNCES = [
  `Ёлки — это не просто красивое дерево. Это прочная древесина.`,
  `Первая большая ёлка была установлена только в 1938 году.`,
  `Вы можете достичь всего. Стоит только немного постараться и запастись книгами.`,
  `Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.`,
  `Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
  `Собрать камни бесконечности легко, если вы прирожденный герой.`,
  `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.`,
  `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
  `Программировать не настолько сложно, как об этом говорят.`,
  `Простые ежедневные упражнения помогут достичь успеха.`,
  `Это один из лучших рок-музыкантов.`,
  `Он написал больше 30 хитов.`,
  `Из под его пера вышло 8 платиновых альбомов.`,
  `Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем.`,
  `Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?`,
  `Достичь успеха помогут ежедневные повторения.`,
  `Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.`,
  `Как начать действовать? Для начала просто соберитесь.`,
  `Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры.`,
  `Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.`,
];

const CATEGORIES = [
  `Деревья`,
  `За жизнь`,
  `Без рамки`,
  `Разное`,
  `IT`,
  `Музыка`,
  `Кино`,
  `Программирование`,
  `Железо`,
];

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

const getAnnounce = () => {
  const MAX_ANNOUNCE_RESTRICT = 5;
  const MIN_ANNOUNCE_RESTRICT = 0;
  const randomTextCount = getRandomInt(
      MIN_ANNOUNCE_RESTRICT,
      MAX_ANNOUNCE_RESTRICT
  );
  return [...Array(randomTextCount)]
    .fill(``)
    .map(() => getRandFromArr(ANNOUNCES))
    .join(` `);
};

const getFullText = () => {
  const randomCount = getRandomInt(1, ANNOUNCES.length - 1);
  return Array(randomCount)
    .fill(``)
    .map(() => getRandFromArr(ANNOUNCES))
    .join(` `);
};

const generateOffers = (count) =>
  Array(count)
    .fill({})
    .map(() => ({
      title: getRandFromArr(TITLES),
      createdDate: getDate(),
      announce: getAnnounce(),
      fullText: getFullText(),
      category: getRandFromArr(CATEGORIES),
    }));

module.exports = {
  name: `--generate`,
  run(args) {
    const [count] = args;
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;
    if (countOffer > MOCK_COUNT_RESTRICT) {
      console.info(`Не больше 1000 объявлений`);
      return;
    }

    const content = JSON.stringify(generateOffers(countOffer));

    fs.writeFile(FILE_NAME, content, (err) => {
      if (err) {
        return console.error(`Can't write data to file...`);
      }

      return console.info(`Operation success. File created.`);
    });
  },
};
