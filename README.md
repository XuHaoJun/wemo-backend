# wemo-backend

## QuickStart

```sh
# install packages
pnpm install --frozen-lockfile

# for db, redis
docker compose up -d

# config your database url
cp .env.example .env

# init prisma client and create all db tables, make sure your database url is right
npx prisma generate
npx prisma migrate deploy

# run it ^_^
npm run start:dev
```

## Swagger

open `http://localhost:3000/swagger`

## Test - multiple rent scooter same time

[k6](https://github.com/grafana/k6) is A modern load testing tool, using Go and JavaScript - [https://k6.io](https://k6.io).

```sh
# generate fake data
npx ts-node ./k6/mutilple_rent_same_scooter/fakeData.ts
# run k6
k6 run .\k6\mutilple_rent_same_scooter\script.js
```

```text
          /\      |‾‾| /‾‾/   /‾‾/
     /\  /  \     |  |/  /   /  /
    /  \/    \    |     (   /   ‾‾\
   /          \   |  |\  \ |  (‾)  |
  / __________ \  |__| \__\ \_____/ .io

     execution: local
        script: .\k6\mutilple_rent_same_scooter\script.js
        output: -

     scenarios: (100.00%) 1 scenario, 200 max VUs, 35s max duration (incl. graceful stop):
              * default: 200 looping VUs for 5s (gracefulStop: 30s)


     ✗ rent success
      ↳  0% — ✓ 10 / ✗ 3771
     ✗ rent failed
      ↳  99% — ✓ 3771 / ✗ 10

     checks.........................: 50.00% ✓ 3781       ✗ 3781
     data_received..................: 1.2 MB 234 kB/s
     http_req_blocked...............: avg=696.46µs min=0s       med=0s       max=18.52ms  p(90)=0s       p(95)=8.99ms
     http_req_connecting............: avg=50.23µs  min=0s       med=0s       max=4ms      p(90)=0s       p(95)=0s
     http_req_duration..............: avg=267.99ms min=144.97ms med=259.36ms max=506.48ms p(90)=360.12ms p(95)=374.99ms
       { expected_response:true }...: avg=167.91ms min=144.97ms med=147.64ms max=234.46ms p(90)=212.45ms p(95)=223.46ms
     http_req_failed................: 99.73% ✓ 3771       ✗ 10
     http_req_receiving.............: avg=61.31µs  min=0s       med=0s       max=1.22ms   p(90)=10.5µs   p(95)=537.29µs
     http_req_sending...............: avg=46.14µs  min=0s       med=0s       max=4.99ms   p(90)=0s       p(95)=14.7µs
     http_req_tls_handshaking.......: avg=0s       min=0s       med=0s       max=0s       p(90)=0s       p(95)=0s
     http_req_waiting...............: avg=267.89ms min=144.97ms med=259.23ms max=506.48ms p(90)=360.01ms p(95)=374.99ms
     http_reqs......................: 3781   731.715639/s
     iteration_duration.............: avg=268.91ms min=152.99ms med=259.82ms max=524.06ms p(90)=361.17ms p(95)=376.59ms
     iterations.....................: 3781   731.715639/s
     vus............................: 200    min=200      max=200
     vus_max........................: 200    min=200      max=200
```
