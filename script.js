const baseUrl = "https://expense-tracking-api-t39p.onrender.com";
const output = document.getElementById("output");

function showResult(data) {
  output.textContent = JSON.stringify(data, null, 2);
}

// ================= USERS =================

// GET all users
async function getAllUsers() {
  const res = await fetch(`${baseUrl}/users`);
  showResult(await res.json());
}

// GET user by ID
async function getUserById() {
  const id = document.getElementById("userId").value;
  const res = await fetch(`${baseUrl}/users/${id}`);
  showResult(await res.json());
}

// CREATE user
async function createUser() {
  const name = document.getElementById("userName").value;
  const email = document.getElementById("userEmail").value;

  const res = await fetch(`${baseUrl}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email }),
  });

  showResult(await res.json());
}

// UPDATE user (PATCH - permite atualização parcial)
async function updateUser() {
  const id = document.getElementById("updateUserId").value;
  const name = document.getElementById("updateUserName").value;
  const email = document.getElementById("updateUserEmail").value;

  // Monta objeto apenas com campos preenchidos
  const userData = {};
  if (name) userData.name = name;
  if (email) userData.email = email;

  const res = await fetch(`${baseUrl}/users/${id}`, {
    method: "PATCH",  // ← MUDANÇA: PUT → PATCH
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  showResult(await res.json());
}

// DELETE user
async function deleteUser() {
  const id = document.getElementById("deleteUserId").value;

  const res = await fetch(`${baseUrl}/users/${id}`, {
    method: "DELETE",
  });

  if (res.ok) {
    showResult({ message: `User with ID ${id} deleted successfully` });
  } else {
    showResult({ error: `Failed to delete user with ID ${id}` });
  }
}

// ================= EXPENSES =================

// GET all expenses
async function getAllExpenses() {
  const res = await fetch(`${baseUrl}/expenses`);
  showResult(await res.json());
}

// GET expense by ID
async function getExpenseById() {
  const id = document.getElementById("expenseId").value;
  const res = await fetch(`${baseUrl}/expenses/${id}`);
  showResult(await res.json());
}

// GET expenses by user ID
async function getExpensesByUser() {
  const userId = document.getElementById("userExpensesId").value;
  const res = await fetch(`${baseUrl}/expenses/user/${userId}`);
  showResult(await res.json());
}

// CREATE expense
async function createExpense() {
  const category = document.getElementById("category").value;
  const amount = parseFloat(document.getElementById("amount").value);
  const rawDate = document.getElementById("date").value;
  const userId = document.getElementById("expenseUserId").value;

  let date = rawDate;
  if (rawDate.includes("/")) {
    const parts = rawDate.split("/");
    date = `${parts[2]}-${parts[1]}-${parts[0]}`;
  }

  const expenseData = {
    category,
    amount,
    date,
    user: { id: parseInt(userId) },
  };

  const res = await fetch(`${baseUrl}/expenses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(expenseData),
  });

  showResult(await res.json());
}

// UPDATE expense (PATCH - permite atualização parcial)
async function updateExpense() {
  const id = document.getElementById("updateExpenseId").value;
  const category = document.getElementById("updateCategory").value;
  const amount = document.getElementById("updateAmount").value;
  const rawDate = document.getElementById("updateDate").value;
  const userId = document.getElementById("updateExpenseUserId").value;

  // Formata data se necessário
  let date = rawDate;
  if (rawDate && rawDate.includes("/")) {
    const parts = rawDate.split("/");
    date = `${parts[2]}-${parts[1]}-${parts[0]}`;
  }

  // Monta objeto apenas com campos preenchidos
  const expenseData = {};
  if (category) expenseData.category = category;
  if (amount) expenseData.amount = parseFloat(amount);
  if (date) expenseData.date = date;
  if (userId) expenseData.user = { id: parseInt(userId) };

  const res = await fetch(`${baseUrl}/expenses/${id}`, {
    method: "PATCH",  // ← MUDANÇA: PUT → PATCH
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(expenseData),
  });

  showResult(await res.json());
}

// DELETE expense
async function deleteExpense() {
  const id = document.getElementById("deleteExpenseId").value;

  const res = await fetch(`${baseUrl}/expenses/${id}`, {
    method: "DELETE",
  });

  if (res.ok) {
    showResult({ message: `Expense with ID ${id} deleted successfully` });
  } else {
    showResult({ error: `Failed to delete expense with ID ${id}` });
  }
}
