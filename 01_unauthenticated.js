import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 5,
  duration: '15s',
  userAgent: 'K6PerformanceTests/1.0',
  iterations: 5,
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


const reviewMessages = [
    'Excellent quality and fast delivery!',
    'Love this product, highly recommended.',
    'Good value for money, will buy again.',
    'Amazing taste and great packaging.',
    'Perfect for my daily needs.',
    'Outstanding customer service experience.',
    'Fresh and delicious every time.',
    'Exceeded my expectations completely.',
    'Great ingredients and eco-friendly.',
    'My family loves this product!',
    'Decent product but could be better.',
    'Not bad, worth trying once.',
    'Average quality, nothing special.',
    'Pretty good for the price point.',
    'Satisfied with my purchase overall.'
  ];

  // Random author names and email patterns (realistic test data)
  const reviewAuthors = [
    'sarah.johnson@email.com',
    'mike.chen@gmail.com', 
    'emma.wilson@yahoo.com',
    'alex.rodriguez@outlook.com',
    'lisa.thompson@email.com',
    'david.kumar@gmail.com',
    'jennifer.lee@yahoo.com',
    'robert.garcia@outlook.com',
    'maria.gonzalez@email.com',
    'james.brown@gmail.com',
    'amy.davis@yahoo.com',
    'chris.miller@outlook.com'
  ];

  // Additional randomization elements
  const reviewPrefixes = [
    'Honestly,',
    'To be honest,', 
    'I have to say,',
    'In my opinion,',
    'From my experience,',
    'After trying this,',
    ''  // Sometimes no prefix
  ];

  const reviewSuffixes = [
    ' Definitely recommend!',
    ' Thanks!',
    ' Keep it up!',
    ' Will order again.',
    ' Good job!',
    ''  // Sometimes no suffix
  ];

  // Build dynamic review
  const randomMessage = reviewMessages[Math.floor(Math.random() * reviewMessages.length)];
  const randomAuthor = reviewAuthors[Math.floor(Math.random() * reviewAuthors.length)];
  const randomPrefix = reviewPrefixes[Math.floor(Math.random() * reviewPrefixes.length)];
  const randomSuffix = reviewSuffixes[Math.floor(Math.random() * reviewSuffixes.length)];
  
  // Create unique review with timestamp
  const runId = Math.floor(Math.random() * 10000);
  const uniqueMessage = `${randomPrefix} ${randomMessage}${randomSuffix} (Test run #${runId})`.trim();


  const reviewBody = JSON.stringify({
    author: randomAuthor,
    message: uniqueMessage
  });

const minProductId = 1;
const maxProductId = 45;
const randomProductId = Math.floor(Math.random() * (maxProductId - minProductId + 1)) + minProductId;

  const reviewRes = http.put(`${baseUrl}/rest/products/${randomProductId}/reviews`, reviewBody, reviewHeaders);

  check(reviewRes, {'Review posted, status is 201': (r) => r.status === 201});

  sleep(1);
}
