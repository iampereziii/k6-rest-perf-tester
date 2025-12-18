import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter } from 'k6/metrics';

export let options = {
    vus: 20,
    duration: '15m', // run for 2 minutes
};

const TOTAL_PRODUCTS = 162;
const LIMIT = 30;
const AUTH_TOKEN = "<YOUR_AUTH_TOKEN_HERE>"; // replace with your actual token

// Custom metric to count requests
let requests = new Counter('requests_made');

export default function () {
    // calculate offset
    let offset = (__ITER * LIMIT) % TOTAL_PRODUCTS;

    let url = `https://magnolia-public.test.accelerator.sanofi/.rest/delivery/products/v1/` +
              `?orderBy=@name%20asc&@ancestor=/US&limit=${LIMIT}&offset=${offset}&hiddenFromCatalog=false`;

    let headers = {
        "Authorization": AUTH_TOKEN,
        "Accept": "application/json",
    };

    let res = http.get(url, { headers });

    check(res, { "status is 200": (r) => r.status === 200 });

    requests.add(1); // increment our custom counter

    sleep(1);
}
