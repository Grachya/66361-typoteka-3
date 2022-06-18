"use strict";

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);
const initDB = require(`../lib/init-db`);
const article = require(`./article`);
const {ArticleService, CommentService} = require(`../data-service`);

const mockCategories = [
  `Деревья`,
  `За жизнь`,
  `Без рамки`,
  `Разное`,
  `IT`,
  `Музыка`,
  `Кино`,
  `Программирование`,
  `Железо`
];

const mockArticles = [
  {
    title: `Ёлки. История деревьев`,
    announce:
      `Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Из под его пера вышло 8 платиновых альбомов. Как начать действовать? Для начала просто соберитесь.`,
    fullText:
      `Золотое сечение — соотношение двух величин, гармоническая пропорция. Как начать действовать? Для начала просто соберитесь.`,
    categories: [
      `Без рамки`,
      `Разное`,
      `Музыка`,
      `Деревья`,
      `Кино`,
      `IT`,
      `Программирование`
    ],
    comments: [
      {
        text: `Плюсую, но слишком много буквы!, Мне не нравится ваш стиль. Ощущение, что вы меня поучаете., Совсем немного...,`,
      },
      {
        text: `Согласен с автором!, Хочу такую же футболку :-), Планируете записать видосик на эту тему?`,
      },
      {
        text: `Плюсую, но слишком много буквы!, Мне кажется или я уже читал это где-то?, Согласен с автором!,`,
      },
    ],
    photo: `sea@1x.jpg`,
  },
  {
    title: `Ёлки. История деревьев`,
    announce: ``,
    fullText:
      `Первая большая ёлка была установлена только в 1938 году. Программировать не настолько сложно, как об этом говорят. Первая большая ёлка была установлена только в 1938 году. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Достичь успеха помогут ежедневные повторения. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Как начать действовать? Для начала просто соберитесь. Он написал больше 30 хитов. Золотое сечение — соотношение двух величин, гармоническая пропорция. Это один из лучших рок-музыкантов.`,
    categories: [
      `Без рамки`,
      `Разное`,
      `Музыка`,
      `Деревья`,
      `Кино`,
      `IT`,
      `Программирование`
    ],
    comments: [
      {
        text: `Хочу такую же футболку :-), Давно не пользуюсь стационарными компьютерами. Ноутбуки победили., Плюсую, но слишком много буквы!,`,
      },
      {
        text: `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили., Это где ж такие красоты?,`,
      },
    ],
    photo: `sea@1x.jpg`,
  },
  {
    title: `Рок — это протест`,
    announce:
      `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Простые ежедневные упражнения помогут достичь успеха. Как начать действовать? Для начала просто соберитесь. Как начать действовать? Для начала просто соберитесь.`,
    fullText:
      `Простые ежедневные упражнения помогут достичь успеха. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
    categories: [
      `Без рамки`,
      `Разное`,
      `Музыка`,
      `Деревья`,
      `Кино`,
      `IT`,
      `Программирование`
    ],
    comments: [
      {
        text: `Планируете записать видосик на эту тему? Совсем немного...,`,
      },
      {
        text: `Мне кажется или я уже читал это где-то?, Плюсую, но слишком много буквы!, Совсем немного...,`,
      },
    ],
    photo: `skyscraper@1x.jpg`,
  },
  {
    title: `Ёлки. История деревьев`,
    announce:
      `Собрать камни бесконечности легко, если вы прирожденный герой. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
    fullText:
      `Из под его пера вышло 8 платиновых альбомов. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
    categories: [
      `Без рамки`,
      `Разное`,
      `Музыка`,
      `Деревья`,
      `Кино`,
      `IT`,
      `Программирование`
    ],
    comments: [
      {
        text: `Планируете записать видосик на эту тему? Согласен с автором!,`,
      },
      {
        text: `Мне кажется или я уже читал это где-то?, Это где ж такие красоты?, Хочу такую же футболку :-),`,
      },
      {
        text: `Хочу такую же футболку :-), Планируете записать видосик на эту тему?`,
      },
    ],
    photo: `skyscraper@1x.jpg`,
  },
  {
    title: `Лучшие рок-музыканты 20-века`,
    announce: ``,
    fullText:
      `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры.`,
    categories: [
      `Без рамки`,
      `Разное`,
      `Музыка`,
      `Деревья`,
      `Кино`,
      `IT`,
      `Программирование`
    ],
    comments: [
      {
        text: `Мне кажется или я уже читал это где-то?, Совсем немного..., Плюсую, но слишком много буквы!,`,
      },
      {
        text: `Согласен с автором!, Планируете записать видосик на эту тему? Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.,`,
      },
      {
        text: `Мне кажется или я уже читал это где-то?, Согласен с автором!, Хочу такую же футболку :-),`,
      },
      {
        text: `Совсем немного..., Хочу такую же футболку :-), Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.,`,
      },
    ],
    photo: `skyscraper@1x.jpg`,
  },
];

const createAPI = async () => {
  const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
  await initDB(mockDB, {categories: mockCategories, articles: mockArticles});
  const app = express();
  app.use(express.json());
  article(app, new ArticleService(mockDB), new CommentService(mockDB));
  return app;
};

const {HttpCode} = require(`../../constants`);

describe(`API returns a list of all articles`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).get(`/articles`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns a list of 5 articles`, () =>
    expect(response.body.length).toBe(5));
});

describe(`API returns an article with given id`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).get(`/articles/3`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Article's title is "Рок — это протест"`, () =>
    expect(response.body.title).toBe(`Рок — это протест`));
});

describe(`API creates an article if data is valid`, () => {
  const newArticle = {
    title: `История страны`,
    announce: `Тот кто не знает истории, обречен ее повторять.`,
    fullText: `В истории страны может быть всякое, и часто она зависит от презедента страны.`,
    categories: [],
    photo: `forest@1x.jpg`,
  };

  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).post(`/articles`).send(newArticle);
  });

  test(`Status code 201`, () =>
    expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Articles count is changed`, () =>
    request(app)
      .get(`/articles`)
      .expect((res) => expect(res.body.length).toBe(6)));
});

describe(`API refuses to create an article if data is invalid`, () => {
  const newArticle = {
    title: `История страны`,
    announce: `Тот кто не знает истории, обречен ее повторять.`,
    fullText: `В истории страны может быть всякое, и часто она зависит от презедента страны.`,
    categories: [`Разное`],
    photo: `forest@1x.jpg`
  };

  test(`Without any required property response code is 400`, async () => {
    const app = await createAPI();
    for (const key of Object.keys(newArticle)) {
      const badArticle = {...newArticle};
      delete badArticle[key];
      await request(app)
        .post(`/articles`)
        .send(badArticle)
        .expect(HttpCode.BAD_REQUEST);
    }
  });
});

describe(`API changes existent article`, () => {
  const newArticle = {
    title: `Новый заголовок`,
    announce: `Тот кто не знает истории, обречен ее повторять.`,
    fullText: `В истории страны может быть всякое, и часто она зависит от презедента страны.`,
    categories: [`Разное`],
    photo: `forest@1x.jpg`,
    createdDate: `27.01.2022, 10:11:47`
  };

  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).put(`/articles/3`).send(newArticle);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Article is really changed`, () =>
    request(app)
      .get(`/articles/3`)
      .expect((res) => expect(res.body.title).toBe(`Новый заголовок`)));
});

test(`API returns status code 404 when trying to change non-existent article`, async () => {
  const validArticle = {
    title: `Это"`,
    announce: `Валидный`,
    fullText: `объект`,
    categories: [`объявления`],
    photo: `forest@1x.jpg`,
  };

  const app = await createAPI();
  return request(app)
    .put(`/articles/999999`)
    .send(validArticle)
    .expect(HttpCode.NOT_FOUND);
});

test(`API returns status code 400 when trying to change an article with invalid data`, async () => {
  const app = await createAPI();

  const invalidArticle = {
    title: `Это"`,
    fullText: `текущего`,
    categories: [`объявления`],
    photo: `forest@1x.jpg,`
  };

  return request(app)
    .put(`/articles/3`)
    .send(invalidArticle)
    .expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes an article`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).delete(`/articles/3`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Articles count is 4 now`, () =>
    request(app)
      .get(`/articles`)
      .expect((res) => expect(res.body.length).toBe(4)));
});

test(`API refuses to delete non-existent article`, async () => {
  const app = await createAPI();

  return request(app).delete(`/articles/NOEXST`).expect(HttpCode.NOT_FOUND);
});

test(`API refuses to create a comment to non-existent article and returns status code 404`, async () => {
  const app = await createAPI();

  return request(app)
    .post(`/articles/NOEXST/comments`)
    .send({
      text: `Неважно`,
    })
    .expect(HttpCode.NOT_FOUND);
});

test(`API refuses to delete non-existent comment`, async () => {
  const app = await createAPI();

  return request(app)
    .delete(`/articles/1/comments/NOEXST`)
    .expect(HttpCode.NOT_FOUND);
});
