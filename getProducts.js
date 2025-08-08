import http from 'k6/http';
import { check } from 'k6';

export const options = {
    vus: 10,
    duration: '5s'
}

export default function() {
    let res = http.get('https://juiceshop-kristinacv-111.onrender.com/search');
    
    check(res, {'Status is 200': (r) => r.status === 200});
}