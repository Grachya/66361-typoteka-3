"use strict";

const {DataTypes, Model} = require(`sequelize`);

class Article extends Model {}

const define = (sequelize) =>
  Article.init(
      {
        title: {
        // eslint-disable-next-line new-cap
          type: DataTypes.STRING(250),
          allowNull: false,
        },
        announce: {
        // eslint-disable-next-line new-cap
          type: DataTypes.STRING(250),
          allowNull: false,
        },
        fullText: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        photo: {
          type: DataTypes.STRING,
        },
      },
      {
        sequelize,
        tableName: `articles`,
      }
  );

module.exports = define;
