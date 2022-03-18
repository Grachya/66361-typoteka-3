# Папка для сценариев API-сервиса

## Attention!
You should generate mocks first. `mocks.json` is in `.gitignore` list.

## Create mock data
- `npm run src/service/service.js --generate` to create 1 post
- `npm run src/service/service.js --generate 10` to create 10 posts

## Get mock data
- `npm run start.dev` to run server on 3000 port
- `http://localhost:3000/posts` to get posts (if there is created mocks.json)