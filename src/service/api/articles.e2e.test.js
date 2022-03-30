"use strict";

const express = require(`express`);
const request = require(`supertest`);

const article = require(`./articles`);
const {ArticleService, CommentService} = require(`../data-service`);

const mockData = [
  {
    id: `2rHv5m`,
    title: `Борьба с прокрастинацией`,
    createdDate: `2022-1-9 5:42:30`,
    announce: `Ёлки — это не просто красивое дерево. Это прочная древесина. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.`,
    fullText: `Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Простые ежедневные упражнения помогут достичь успеха.`,
    category: `Разное`,
    comments: [
      {
        id: `R2qwN9`,
        text: `Хочу такую же футболку :-), Плюсую, но слишком много буквы!, Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.,`,
      },
      {
        id: `lVlhcB`,
        text: `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.,`,
      },
      { id: `k2Jxcp`, text: `Мне кажется или я уже читал это где-то?,` },
    ],
  },
  {
    id: `W6m3vr`,
    title: `Как начать программировать`,
    createdDate: `2022-1-6 21:06:22`,
    announce: `Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры.`,
    fullText: `Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Достичь успеха помогут ежедневные повторения. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Программировать не настолько сложно, как об этом говорят. Собрать камни бесконечности легко, если вы прирожденный герой. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.`,
    category: `За жизнь`,
    comments: [
      { id: `_2uhPl`, text: `Плюсую, но слишком много буквы!,` },
      {
        id: `25F8Eu`,
        text: `Хочу такую же футболку :-), Планируете записать видосик на эту тему?`,
      },
    ],
  },
  {
    id: `iIAeVJ`,
    title: `Борьба с прокрастинацией`,
    createdDate: `2022-3-1 18:20:45`,
    announce: `Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Как начать действовать? Для начала просто соберитесь. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Как начать действовать? Для начала просто соберитесь. Он написал больше 30 хитов.`,
    fullText: `Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Первая большая ёлка была установлена только в 1938 году. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Как начать действовать? Для начала просто соберитесь. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Из под его пера вышло 8 платиновых альбомов. Он написал больше 30 хитов.`,
    category: `За жизнь`,
    comments: [
      { id: `2EDwCB`, text: `Это где ж такие красоты?,` },
      {
        id: `JTvcds`,
        text: `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили., Хочу такую же футболку :-),`,
      },
      {
        id: `4nkxpC`,
        text: `Это где ж такие красоты?, Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.,`,
      },
      {
        id: `wgCUdH`,
        text: `Планируете записать видосик на эту тему? Согласен с автором!,`,
      },
    ],
  },
  {
    id: `bCgRjn`,
    title: `Борьба с прокрастинацией`,
    createdDate: `2022-1-15 23:49:15`,
    announce: `Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Из под его пера вышло 8 платиновых альбомов. Ёлки — это не просто красивое дерево. Это прочная древесина.`,
    fullText: `Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Как начать действовать? Для начала просто соберитесь. Золотое сечение — соотношение двух величин, гармоническая пропорция. Собрать камни бесконечности легко, если вы прирожденный герой. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?`,
    category: `Деревья`,
    comments: [
      {
        id: `cWDqt-`,
        text: `Хочу такую же футболку :-), Планируете записать видосик на эту тему? Плюсую, но слишком много буквы!,`,
      },
      {
        id: `4vQLdz`,
        text: `Планируете записать видосик на эту тему? Совсем немного...,`,
      },
      {
        id: `HTQS9w`,
        text: `Хочу такую же футболку :-), Согласен с автором!,`,
      },
    ],
  },
  {
    id: `6XU_qP`,
    title: `Самый лучший музыкальный альбом этого года`,
    createdDate: `2022-1-26 22:04:33`,
    announce: `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Первая большая ёлка была установлена только в 1938 году. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Вы можете достичь всего. Стоит только немного постараться и запастись книгами.`,
    fullText: `Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Как начать действовать? Для начала просто соберитесь. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Ёлки — это не просто красивое дерево. Это прочная древесина. Первая большая ёлка была установлена только в 1938 году. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Золотое сечение — соотношение двух величин, гармоническая пропорция. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.`,
    category: `Музыка`,
    comments: [
      {
        id: `FrCbBG`,
        text: `Совсем немного..., Мне не нравится ваш стиль. Ощущение, что вы меня поучаете., Плюсую, но слишком много буквы!,`,
      },
      {
        id: `XqFt0L`,
        text: `Планируете записать видосик на эту тему? Совсем немного...,`,
      },
      { id: `_Ng2H7`, text: `Мне кажется или я уже читал это где-то?,` },
      { id: `LTU7xm`, text: `Совсем немного...,` },
    ],
  },
  {
    id: `hDh2jJ`,
    title: `Борьба с прокрастинацией`,
    createdDate: `2022-2-22 0:22:40`,
    announce: `Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.`,
    fullText: `Простые ежедневные упражнения помогут достичь успеха. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Собрать камни бесконечности легко, если вы прирожденный герой. Первая большая ёлка была установлена только в 1938 году. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Как начать действовать? Для начала просто соберитесь. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Программировать не настолько сложно, как об этом говорят. Собрать камни бесконечности легко, если вы прирожденный герой. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.`,
    category: `Железо`,
    comments: [
      {
        id: `rfWJXt`,
        text: `Плюсую, но слишком много буквы!, Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.,`,
      },
    ],
  },
];

const createAPI = () => {
  const cloneData = JSON.parse(JSON.stringify(mockData));
  const app = express();
  app.use(express.json());
  article(app, new ArticleService(cloneData), new CommentService(cloneData));
  return app;
};

const {HttpCode} = require(`../../constants`);

describe(`API returns a list of all articles`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app).get(`/articles`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns a list of 6 articles`, () =>
    expect(response.body.length).toBe(6));

  test(`First article's id equals "2rHv5m"`, () =>
    expect(response.body[0].id).toBe(`2rHv5m`));
});

describe(`API returns an article with given id`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app).get(`/articles/W6m3vr`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Article's title is "Как начать программировать"`, () =>
    expect(response.body.title).toBe(`Как начать программировать`));
});

describe(`API creates an article if data is valid`, () => {
  const newArticle = {
    title: `История страны`,
    announce: `Тот кто не знает истории, обречен ее повторять.`,
    fullText: `В истории страны может быть всякое, и часто она зависит от презедента страны.`,
    category: `Разное`,
  };

  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app).post(`/articles`).send(newArticle);
  });

  test(`Status code 201`, () =>
    expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Returns article created`, () =>
    expect(response.body).toEqual(expect.objectContaining(newArticle)));

  test(`Articles count is changed`, () =>
    request(app)
      .get(`/articles`)
      .expect((res) => expect(res.body.length).toBe(7)));
});

describe(`API refuses to create an article if data is invalid`, () => {
  const newArticle = {
    title: `История страны`,
    announce: `Тот кто не знает истории, обречен ее повторять.`,
    fullText: `В истории страны может быть всякое, и часто она зависит от презедента страны.`,
    category: `Разное`,
  };

  const app = createAPI();

  test(`Without any required property response code is 400`, async () => {
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
    title: `История страны`,
    announce: `Тот кто не знает истории, обречен ее повторять.`,
    fullText: `В истории страны может быть всякое, и часто она зависит от презедента страны.`,
    category: `Разное`,
  };

  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app).put(`/articles/W6m3vr`).send(newArticle);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns changed article`, () =>
    expect(response.body).toEqual(expect.objectContaining(newArticle)));

  test(`Article is really changed`, () =>
    request(app)
      .get(`/articles/W6m3vr`)
      .expect((res) => expect(res.body.title).toBe(`История страны`)));
});

test(`API returns status code 404 when trying to change non-existent article`, () => {
  const app = createAPI();

  const validArticle = {
    title: `Это"`,
    announce: `Валидный`,
    fullText: `объект`,
    category: `объявления`,
  };

  return request(app)
    .put(`/articles/NOEXST`)
    .send(validArticle)
    .expect(HttpCode.NOT_FOUND);
});

test(`API returns status code 400 when trying to change an article with invalid data`, () => {
  const app = createAPI();

  const invalidArticle = {
    title: `Это"`,
    fullText: `текущего`,
    category: `объявления`,
  };

  return request(app)
    .put(`/articles/W6m3vr`)
    .send(invalidArticle)
    .expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes an article`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app).delete(`/articles/W6m3vr`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns deleted article`, () =>
    expect(response.body.id).toBe(`W6m3vr`));

  test(`Articles count is 5 now`, () =>
    request(app)
      .get(`/articles`)
      .expect((res) => expect(res.body.length).toBe(5)));
});

test(`API refuses to delete non-existent article`, () => {
  const app = createAPI();

  return request(app).delete(`/articles/NOEXST`).expect(HttpCode.NOT_FOUND);
});


test(`API refuses to create a comment to non-existent article and returns status code 404`, () => {
  const app = createAPI();

  return request(app)
    .post(`/articles/NOEXST/comments`)
    .send({
      text: `Неважно`,
    })
    .expect(HttpCode.NOT_FOUND);
});

test(`API refuses to delete non-existent comment`, () => {
  const app = createAPI();

  return request(app)
    .delete(`/articles/W6m3vr/comments/NOEXST`)
    .expect(HttpCode.NOT_FOUND);
});
