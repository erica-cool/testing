import http from 'k6/http';
import { check, fail, sleep } from 'k6';


export default function () {
  const response = http.get('https://test-api.k6.io');
  if (!check(response, {
    'is status 200': (r) => r.status === 200,
  })) {
    fail('status was not 200');
  }

  sleep(1);
}

// smoke_test_options
// status: passed
export const smoke_test_options = {
  vus: 1,
  duration: '13s',
  thresholds: {
    http_req_duration: ['p(95)<400'],
    // http_req_duration: ['p(99)<500'] crossed
  },
};

// load_test_options 
// status: passed
export const load_test_options = {
  stages : [
    { duration: '20s', target: 100 },
    { duration: '2m', target: 1000 },
    { duration: '20s', target: 5 },
  ],
  thresholds: {
    http_req_duration: ['p(99)<500'],
  },
};

// stress_test_options
// status: 99% — ✓ 360328 / ✗ 320
export const stress_test_options = {
  stages : [
    { duration: '2m', target: 100 },
    { duration: '5m', target: 100 },
    { duration: '2m', target: 200 },
    { duration: '5m', target: 200 },
    { duration: '2m', target: 300 },
    { duration: '5m', target: 300 },
    { duration: '2m', target: 400 },
    { duration: '5m', target: 400 },
    { duration: '10m', target: 0 },
  ],
};

// spike_test_options
export const options = {
  stages : [
    { duration: '2m', target: 10 },
    { duration: '1s', target: 100 },
    { duration: '2m', target: 0 },
  ],
};

export const soak_test_options = {
  stages : [
    { duration: '2m', target: 400 },
    { duration: '1h56m', target: 400 },
    { duration: '2m', target: 0 },
  ],
};