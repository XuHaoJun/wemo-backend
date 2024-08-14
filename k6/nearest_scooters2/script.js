import http from 'k6/http';
import { check } from 'k6';

export const options = {
  // A number specifying the number of VUs to run concurrently.
  vus: 200,
  // A string specifying the total duration of the test run.
  duration: '5s',
};

export default function () {
  const coords = getRandomCoordinate();
  const payload = JSON.stringify({
    lng: coords.longitude,
    lat: coords.latitude,
  });
  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const res = http.post(
    'http://localhost:3000/scooters/search/nearest2',
    payload,
    params,
  );
  // Validate response status
  check(res, {
    'scooters == 0': (r) => r.status === 201 && r.json().length === 0,
    'scooters => 1 && <= 10 ': (r) =>
      r.status === 201 && r.json().length <= 10 && r.json().length >= 1,
    'scooters > 10': (r) => r.status === 201 && r.json().length > 10,
  });
}

function getRandomCoordinate() {
  // 台灣範圍內的經緯度範圍
  const minLat = 21.8;
  const maxLat = 25.3;
  const minLng = 119.5;
  const maxLng = 122.0;

  // 生成隨機緯度和經度
  const latitude = Math.random() * (maxLat - minLat) + minLat;
  const longitude = Math.random() * (maxLng - minLng) + maxLng;

  return { latitude, longitude };
}
