import http from "k6/http";
import { check } from "k6";

export const options = {
  vus: 2,
  iterations: 2
};

export default function () {
  const payload = JSON.stringify({
    amount: __VU === 1 ? 5000 : 10000,
    device: __VU === 1 ? "HP_ANDI" : "HP_ADIK"
  });

  const headers = { "Content-Type": "application/json" };

  const res = http.post(
    "http://localhost:3000/purchase",
    payload,
    { headers }
  );

  check(res, {
    "status is 200": r => r.status === 200
  });
}

