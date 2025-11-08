const baseUrl = "https://expense-tracking-api-t39p.onrender.com";
const output = document.getElementById("output");

function showResult(data) {
  output.textContent = JSON.stringify(data, null, 2);
}

// ================= USERS =================
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

async function updateUser() {
  const id = document.getElementById("updateUserId").value;
  const name = document.getElementById("updateUserName").value;
  const email = document.getElementById("updateUserEmail").value;

  const res = await fetch(`${baseUrl}/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email })
  });

  showResult(await res.json());
}

async function deleteUser() {
  const id = document.getElementById("deleteUserId").value;
  const res = await fetch(`${baseUrl}/users/${id}`, { method: "DELETE" });
  showResult({ message: `User ${id} deleted successfully.` });
}

// ================= EXPENSES =================
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
  const rawDate = document.getElementById("date").value;
  const userId = document.getElementById("expenseUserId").value;

  // Format date if needed
  let date = rawDate;
  if (rawDate.includes("/")) {
    const parts = rawDate.split("/");
    date = `${parts[2]}-${parts[1]}-${parts[0]}`;
  }

  const expenseData = {
    category,
    amount,
    date,
    user: { id: parseInt(userId) }
  };

  const res = await fetch(`${baseUrl}/expenses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(expenseData)
  });

  showResult(await res.json());
}

async function updateExpense() {
  const id = document.getElementById("updateExpenseId").value;
  const category = document.getElementById("updateCategory").value;
  const amount = parseFloat(document.getElementById("updateAmount").value);
  const rawDate = document.getElementById("updateDate").value;
  const userId = document.getElementById("updateUserIdExpense").value;

  let date = rawDate;
  if (rawDate.includes("/")) {
    const parts = rawDate.split("/");
    date = `${parts[2]}-${parts[1]}-${parts[0]}`;
  }

  const expenseData = {
    category,
    amount,
    date,
    user: { id: parseInt(userId) }
  };

  const res = await fetch(`${baseUrl}/expenses/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(expenseData)
  });

  showResult(await res.json());
}

async function deleteExpense() {
  const id = document.getElementById("deleteExpenseId").value;
  const res = await fetch(`${baseUrl}/expenses/${id}`, { method: "DELETE" });
  showResult({ message: `Expense ${id} deleted successfully.` });
}


