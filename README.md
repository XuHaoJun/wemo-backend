# wemo-backend

## QuickStart

```sh
# install packages
pnpm install --frozen-lockfile

# for db, redis
docker compose up -d

# create all db tables
npx prisma migrate deploy

# run it ^_^
npm run start:dev
```
