import http from 'k6/http';
import { check } from 'k6';

export const options = {
  // A number specifying the number of VUs to run concurresevely.
  vus: 200,
  // A string specifying the total duration of the test run.
  duration: '10s',
};

export default function () {
  function randomIntFromInterval(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  const userId = randomIntFromInterval(1, 10);
  const scooterId = randomIntFromInterval(1, 10);
  const body = {
    userId,
    scooterId,
  };
  const payload = JSON.stringify(body);
  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const res = http.post('http://localhost:3000/reservations', payload, params);
  // Validate response status
  check(res, {
    'user id == 1, reserve success': (r) => userId === 1 && r.status === 201,
    'user id == 1, reserve failed': (r) => userId === 1 && r.status === 400,
    'user id == 2, reserve success': (r) => userId === 2 && r.status === 201,
    'user id == 2, reserve failed': (r) => userId === 2 && r.status === 400,
    'reserve success': (r) => r.status === 201,
    'reserve failed': (r) => r.status === 400,
  });
  if (res.status === 201) {
    const res2 = http.post(
      'http://localhost:3000/reservations',
      payload,
      params,
    );
    check(res2, {
      'reserve again failed': (r) => r.status === 400,
    });
  }
}
