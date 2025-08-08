import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 1,
  duration: '15s',
  userAgent: 'K6PerformanceTests/1.0',
  iterations: 1,
};

export default function () {
  const baseUrl = 'https://juiceshop-kristinacv-111.onrender.com';

  // Go to homepage
  const getRes = http.get(baseUrl);
  check(getRes, {
    'status is 200': (r) => r.status === 200,
  });


  // Login
  const loginBody = JSON.stringify({
    email: 'admin@juice-sh.op',
    password: 'admin123'
  });

  const loginParams = {
    headers: {
          'Content-Type': 'application/json'
        }
    };

  const loginRes = http.post(`${baseUrl}/rest/user/login`, loginBody, loginParams);
  
check(loginRes, {'Login status is 200': (r) => r.status === 200});

    let token;
  const loginData = loginRes.json();
  token = loginData.authentication.token;

  const authHeaders = {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    }
  }
  
  // Get user's cart content
  const res = http.get(`${baseUrl}/rest/basket/0`, authHeaders);

  check(res, {
    'status is 200': (r) => r.status === 200,
  });

  // Leave a review
  const reviewHeaders = {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };

  const reviewBody = JSON.stringify({
    author: 'admin@juice-sh.op',
    message: 'bla'
  });

  const reviewRes = http.put(`${baseUrl}/rest/products/1/reviews`, reviewBody, reviewHeaders);

  check(reviewRes, {'Review posted, status is 201': (r) => r.status === 201});

  sleep(1);
}
