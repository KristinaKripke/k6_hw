import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
stages: [
    { duration: '5s', target: 10 },  
    { duration: '5s', target: 25 },
    { duration: '5s', target: 35 },
    { duration: '5s', target: 45 },
    { duration: '5s', target: 55 },
    { duration: '5s', target: 0 },   
],
    thresholds: {
    http_req_duration: ['p(95)<5000'],  
    },
};

export default function () {
    const baseUrl = 'https://juiceshop-kristinacv-111.onrender.com';

    const res = http.get(baseUrl);
    check(res, {
    'status is 200': (r) => r.status === 200,
    });

    sleep(1);
}