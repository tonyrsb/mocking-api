const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(express.json());

// ===============================
// MOCK DATABASE (IN-MEMORY)
// ===============================
let userAccount = {
  userId: "andi",
  balance: 100000
};

// ===============================
// GET BALANCE
// ===============================
app.get("/balance", async (req, res) => {
  res.json({
    userId: userAccount.userId,
    balance: userAccount.balance
  });
});

// ===============================
// PURCHASE PULSA (RACE CONDITION)
// ===============================
app.post("/purchase", async (req, res) => {
  const { amount, device } = req.body;

  // Step 1: Read balance
  const currentBalance = userAccount.balance;
  console.log(`[${device}] Read balance: ${currentBalance}`);

  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Step 2: Validate
  if (currentBalance < amount) {
    return res.status(400).json({
      message: "Saldo tidak cukup"
    });
  }

  // Step 3: Deduct balance
  userAccount.balance = currentBalance - amount;
  console.log(
    `[${device}] Purchase ${amount}, new balance: ${userAccount.balance}`
  );

  res.json({
    message: "Pembelian pulsa berhasil",
    device,
    amount,
    balanceAfter: userAccount.balance
  });
});

app.listen(3000, () => {
  console.log("Mock API running on http://localhost:3000");
});
