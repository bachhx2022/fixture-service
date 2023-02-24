# Description

This application is a web application based on NestJS for Fixtures Service.

**Features**
- A user can view Fixtures Listing
- A user can get Fixtures Calendar

# Documents

```bash
/documents/system_design_document.docx
```

# Project Structure

This project is based on Nest.js, a Node.js framework (https://nestjs.com/).
It contains 3 modules and one library as follows:

```bash
-- src
    |-- matches
        |-- matches.controller.ts
        |-- matches.service.ts
        |-- matches.controller.spec.ts
        |-- matches.service.spec.ts
    |-- teams

    |-- tournaments

   libs
    |-- common
	   |-- src
```

- The "matches" module is responsible for accepting requests from users to view Fixtures Listing and calendar.
- The "teams" module contains model for team.
- The "tournaments" module contains model for tournament.

# Installation

```bash
$ npm install
```

## Running the app

### 1. Install Docker & Docker compose

### 2. Install Dependencies

```bash
$ npm install
```

### 3. Start App

```bash
$ docker-compose up
```

Wait until all services are available and ready to accept requests. <br>
This command will install all necessary services for the app, including:

- postgresql (with one postgresql database named **`fixtures`**, see /db/01-init.sh)
- redis
- fixture-service

**Note:** We also have script to dumb data `src\matches\seeder.ts`
# Swagger

```bash
http://localhost:3000/api
```

# How to use

### 1. Go to db and get a tournament Id

### 2. View Fixtures Listing
Update TOURNAMENT_ID with Id in step 1.
You can also modify other parameters such as the date range for more specific search results.

```bash
curl --location 'http://localhost:3000/matches?tournamentId=<TOURNAMENT_ID>&from=2023-01-01T00%253A00%253A00.000Z&to=2023-01-31T00%253A00%253A00.000Z&page=1&pageSize=20&sortField=startAt' \
--header 'accept: */*'
```

### 3. Get Calendar
Update TOURNAMENT_ID with Id in step 1.
You can also modify other parameters such as the date range, timezone for more specific search results.

```bash
curl --location 'http://localhost:3000/matches/calendar?tournamentId=<TOURNAMENT_ID>&from=2023-01-01T00%253A00%253A00.000Z&to=2023-01-31T00%253A00%253A00.000Z&timezone=Asia%252FHo_Chi_Minh' \
--header 'accept: */*'
```

# Unit Testing

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov

```

**Files under test**
- matches.controller.ts
- matches.service.ts

# Integration Testing
The tests use a real database, redis to ensure that code works correctly in the actual environment where it will be deployed.
<br/>
However, using a real database for tests can be slower and more resource-intensive than using a mock database.

### Run docker compose
```bash
docker-compose -f test/docker-compose.yml -p fixture-service-e2e up 
```
### Run test
```bash
npm run test:e2e
```

# Lint

```bash
$ npm run lint
```

# Formating

```bash
$ npm run format
```
