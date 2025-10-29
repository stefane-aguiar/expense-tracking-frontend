const baseUrl = "https://expense-tracking-api-t39p.onrender.com";

const output = document.getElementById("output");

function showResult(data) {
  output.textContent = JSON.stringify(data, null, 2);
}

// USERS
async function getAllUsers() {
  const res = await fetch(`${baseUrl}/users`);
  showResult(await res.json());
}

async function getUserById() {
  const id = document.getElementById("userId").value;
  const res = await fetch(`${baseUrl}/users/${id}`);
  showResult(await res.json());
}

async function createUser() {
  const name = document.getElementById("userName").value;
  const email = document.getElementById("userEmail").value;

  const res = await fetch(`${baseUrl}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email })
  });

  showResult(await res.json());
}

// EXPENSES
async function getAllExpenses() {
  const res = await fetch(`${baseUrl}/expenses`);
  showResult(await res.json());
}

async function getExpenseById() {
  const id = document.getElementById("expenseId").value;
  const res = await fetch(`${baseUrl}/expenses/${id}`);
  showResult(await res.json());
}

async function getExpensesByUser() {
  const userId = document.getElementById("userExpensesId").value;
  const res = await fetch(`${baseUrl}/expenses/user/${userId}`);
  showResult(await res.json());
}

async function createExpense() {
  const category = document.getElementById("category").value;
  const amount = parseFloat(document.getElementById("amount").value);
  const date = document.getElementById("date").value;
  const userId = document.getElementById("expenseUserId").value;

  const res = await fetch(`${baseUrl}/expenses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ category, amount, date, userId })
  });

  showResult(await res.json());
}
