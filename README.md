## Setup

1. Run `docker-compose up`
2. Apply Prisma migrations: `prisma migrate dev`
3. Seed the database: `node seed.ts`
4. Install dependencies: `yarn install`
5. Start the development server: `yarn dev`

## API

Test routes with Postman:

- http://localhost:4000/prisma
- http://localhost:4000/pg
- http://localhost:4000/prisma-raw

## Issues

1. Prisma queries take 15 times longer compared to pg query.
2. If we execute a Prisma query five times, it takes three to four times longer compared to the preceding five queries.
