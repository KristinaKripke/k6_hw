import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  // A number specifying the number of VUs to run concurrently.
  vus: 10,
  // A string specifying the total duration of the test run.
  duration: '15s',
};

// The function that defines VU logic.
//
// See https://grafana.com/docs/k6/latest/examples/get-started-with-k6/ to learn more
// about authoring k6 scripts.
//
// Is looped through nonstop until duration time passes (see duration parameter above)
export default function () {
  // Send a get request to your juiceshop webpage
  http.get('https://juiceshop-kristinacv-111.onrender.com');
  // Wait a second before running default function again
  sleep(1);
}
