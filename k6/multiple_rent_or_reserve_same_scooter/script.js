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
  const userId = randomIntFromInterval(1, 20);
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
  const api = [
    { action: 'reserve', url: 'http://localhost:3000/reservations' },
    { action: 'rent', url: 'http://localhost:3000/rents' },
  ][randomIntFromInterval(0, 1)];
  const res = http.post(api.url, payload, params);
  // Validate response status
  check(res, {
    'rent success': (r) => api.action === 'rent' && r.status === 201,
    'rent failed': (r) => api.action === 'rent' && r.status === 400,
    'reserve success': (r) => api.action === 'reserve' && r.status === 201,
    'reserve failed': (r) => api.action === 'reserve' && r.status === 400,
  });
  if (res.status === 201) {
    const res2 = http.post(api.url, payload, params);
    check(res2, {
      'reserve again failed': (r) => r.status === 400,
    });
  }
}
