# wemo-backend

## QuickStart

```sh
# install packages
pnpm install --frozen-lockfile

# for db, redis
docker compose up -d

# config your database url
cp .env.example .env

# create all db tables, make sure your database url is right
npx prisma migrate deploy

# run it ^_^
npm run start:dev
```