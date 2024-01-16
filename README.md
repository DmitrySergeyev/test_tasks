## Get started

Execute followed command for running and testing application

1. `cp .env.dev .env` - creating env file
2. `npm ci` - installing dependencies
3. `docker-compose build` - build application docker image
4. `docker-compose up -d` - starting database and application
5. `docker-compose exec node1 npm run db:migration:run` - running migrations
6. `docker-compose exec node1 npm run test` - running unit test
7. `docker-compose exec node1 npm run test:e2e` - running integration test

## API
 
1. `POST http://localhost:3333/event` - create new event 
```JSON
{
    "name": "tes1",
    "startDate": "2020-06-01",
    "endDate": "2020-06-02",
    "description": "desc1"
}
````

2. `GET http://localhost:3333/event` - receive all existed events

### P.S.

This repository contains some test task solution, not the API of the real project.