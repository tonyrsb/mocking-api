## race-condition-mocking-api

Simple Node.js API to demonstrate a **race condition** in a phone-credit (pulsa) purchase flow using a balance stored in an in‑memory "database".

This project contains:
- **API Server** (`app.js`) built with `Express`
- **Load / race test script** (`race-condition-test.js`) using `k6` to simulate 2 devices purchasing at the same time

---

### Tech stack

- **Node.js** (Express)
- **npm**
- **k6** (for load/race testing)

---

### Endpoints

- **GET `/balance`**
  - Returns the current user balance.
  - Example response:
    ```json
    {
      "userId": "andi",
      "balance": 100000
    }
    ```

- **POST `/purchase`**
  - Request body (JSON):
    ```json
    {
      "amount": 5000,
      "device": "HP_ANDI"
    }
    ```
  - Behaviour:
    - Read current balance
    - Wait 2 seconds (simulate processing)
    - Check whether the balance is sufficient
    - Deduct the balance and return the result

Example curl:

```bash
curl -X POST http://localhost:3000/purchase \
  -H "Content-Type: application/json" \
  -d '{"amount": 5000, "device": "HP_ANDI"}'
```

---

### Prerequisites

- Node.js v16+ (recommended)
- npm
- `k6` installed globally (to run `race-condition-test.js`)
  - Install k6: see the official docs `https://k6.io/docs/get-started/installation/`

---

### Setup & run the project

#### 1. Clone the repository

```bash
git clone git@github.com-tonyrsb:tonyrsb/mocking-api.git
cd mocking-api
```

> Or adjust to the repository URL you are actually using.

#### 2. Install dependencies

```bash
npm install
```

#### 3. Run the server (normal mode)

```bash
npm start
```

The server will be available at:

```text
http://localhost:3000
```

#### 4. Run the server (development mode, auto-restart)

```bash
npm run dev
```

Endpoints you can try:

- Check balance:
  ```bash
  curl http://localhost:3000/balance
  ```
- Try a manual purchase:
  ```bash
  curl -X POST http://localhost:3000/purchase \
    -H "Content-Type: application/json" \
    -d '{"amount": 5000, "device": "HP_ANDI"}'
  ```

---

### Running the race condition simulation (k6)

The `race-condition-test.js` script simulates:
- **2 VUs (virtual users)** acting as 2 devices:
  - VU 1: `amount = 5000`, `device = "HP_ANDI"`
  - VU 2: `amount = 10000`, `device = "HP_ADIK"`
- Each performs 2 iterations (`iterations: 2`)

Make sure the server is running at `http://localhost:3000`, then run:

```bash
npm run test:race
```

The command above is equivalent to:

```bash
k6 run race-condition-test.js
```

Watch the logs in the Node.js terminal; you will see the sequence:
- Each device reads the current balance
- 2-second delay
- Balance is deducted and written back

This illustrates the **race condition** caused by the shared state (`userAccount.balance`) being accessed in parallel without any locking/transaction mechanism.

---

### Additional notes

- User data and balance are stored only in memory (`userAccount` in `app.js`), so every time you restart the server the balance is reset to the initial value.
- This project is for learning purposes only (race conditions / concurrency issues); **do not** use it as-is in production.

