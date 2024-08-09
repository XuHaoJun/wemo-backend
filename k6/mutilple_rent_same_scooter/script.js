import http from 'k6/http';
import { check } from 'k6';

export const options = {
  // A number specifying the number of VUs to run concurrently.
  vus: 200,
  // A string specifying the total duration of the test run.
  duration: '5s',
};

export default function () {
  function randomIntFromInterval(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  const body = {
    userId: randomIntFromInterval(1, 100000),
    scooterId: randomIntFromInterval(1, 10),
  };
  const payload = JSON.stringify(body);
  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const res = http.post('http://localhost:3000/rents', payload, params);
  // Validate response status
  check(res, {
    'rent success': (r) => r.status === 201,
    'rent failed': (r) => r.status === 400,
  });
}
