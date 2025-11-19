const baseUrl = "https://expense-tracking-api-t39p.onrender.com";
const output = document.getElementById("output");

function showResult(data) {
  // Se já for string, mostra direto; senão stringify
  if (typeof data === "string") {
    output.textContent = data;
  } else {
    output.textContent = JSON.stringify(data, null, 2);
  }
}

async function handleResponse(res) {
  // Retorna um objeto uniformizado: { ok, status, data }
  const contentType = res.headers.get("content-type") || "";
  if (res.status === 204) {
    return { ok: res.ok, status: res.status, data: { message: "No Content" } };
  }

  // tenta parsear JSON quando o content-type indica JSON
  if (contentType.includes("application/json")) {
    try {
      const json = await res.json();
      return { ok: res.ok, status: res.status, data: json };
    } catch (err) {
      // corpo inválido ou parse falhou
      return { ok: res.ok, status: res.status, data: { message: "Resposta JSON inválida", error: err.message } };
    }
  }

  // tenta texto como fallback
  try {
    const text = await res.text();
    return { ok: res.ok, status: res.status, data: text };
  } catch (err) {
    return { ok: res.ok, status: res.status, data: { message: "Não foi possível ler a resposta", error: err.message } };
  }
}

// helper para checar id obrigatório
function requireId(id, fieldName = "ID") {
  if (!id && id !== 0) {
    throw new Error(`${fieldName} é obrigatório.`);
  }
}

// ================= USERS =================

// GET all users
async function getAllUsers() {
  try {
    const res = await fetch(`${baseUrl}/users`);
    const handled = await handleResponse(res);
    showResult(handled);
  } catch (err) {
    showResult({ error: err.message });
  }
}

// GET user by ID
async function getUserById() {
  try {
    const id = document.getElementById("userId").value.trim();
    requireId(id, "User ID");
    const res = await fetch(`${baseUrl}/users/${encodeURIComponent(id)}`);
    const handled = await handleResponse(res);
    showResult(handled);
  } catch (err) {
    showResult({ error: err.message });
  }
}

// CREATE user
async function createUser() {
  try {
    const name = document.getElementById("userName").value.trim();
    const email = document.getElementById("userEmail").value.trim();

    const res = await fetch(`${baseUrl}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });

    const handled = await handleResponse(res);
    showResult(handled);
  } catch (err) {
    showResult({ error: err.message });
  }
}

// UPDATE user
async function updateUser() {
  try {
    const id = document.getElementById("updateUserId").value.trim();
    requireId(id, "User ID");

    const name = document.getElementById("updateUserName").value.trim();
    const email = document.getElementById("updateUserEmail").value.trim();

    const userData = {};
    if (name) userData.name = name;
    if (email) userData.email = email;

    if (Object.keys(userData).length === 0) {
      // Se o backend aceita PATCH sem body você pode enviar {}, mas geralmente isso é erro do lado servidor.
      showResult({ warning: "Nenhum campo para atualizar. Preencha 'New Name' e/ou 'New Email'." });
      return;
    }

    const res = await fetch(`${baseUrl}/users/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const handled = await handleResponse(res);
    showResult(handled);
  } catch (err) {
    showResult({ error: err.message });
  }
}

// DELETE user
async function deleteUser() {
  try {
    const id = document.getElementById("deleteUserId").value.trim();
    requireId(id, "User ID");

    const res = await fetch(`${baseUrl}/users/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });

    const handled = await handleResponse(res);
    if (res.ok) {
      showResult({ message: `User with ID ${id} deleted successfully`, response: handled });
    } else {
      showResult({ error: `Failed to delete user with ID ${id}`, response: handled });
    }
  } catch (err) {
    showResult({ error: err.message });
  }
}

// ================= EXPENSES =================

// GET all expenses
async function getAllExpenses() {
  try {
    const res = await fetch(`${baseUrl}/expenses`);
    const handled = await handleResponse(res);
    showResult(handled);
  } catch (err) {
    showResult({ error: err.message });
  }
}

// GET expense by ID
async function getExpenseById() {
  try {
    const id = document.getElementById("expenseId").value.trim();
    requireId(id, "Expense ID");
    const res = await fetch(`${baseUrl}/expenses/${encodeURIComponent(id)}`);
    const handled = await handleResponse(res);
    showResult(handled);
  } catch (err) {
    showResult({ error: err.message });
  }
}

// GET expenses by user ID
async function getExpensesByUser() {
  try {
    const userId = document.getElementById("userExpensesId").value.trim();
    requireId(userId, "User ID");
    const res = await fetch(`${baseUrl}/expenses/user/${encodeURIComponent(userId)}`);
    const handled = await handleResponse(res);
    showResult(handled);
  } catch (err) {
    showResult({ error: err.message });
  }
}

// CREATE expense
async function createExpense() {
  try {
    const category = document.getElementById("category").value.trim();
    const amountRaw = document.getElementById("amount").value;
    const rawDate = document.getElementById("date").value;
    const userId = document.getElementById("expenseUserId").value.trim();

    if (!category || !amountRaw || !userId) {
      showResult({ error: "Category, Amount e User ID são obrigatórios para criar uma expense." });
      return;
    }

    const amount = parseFloat(amountRaw);
    let date = rawDate;
    if (rawDate && rawDate.includes("/")) {
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

    const handled = await handleResponse(res);
    showResult(handled);
  } catch (err) {
    showResult({ error: err.message });
  }
}

// UPDATE expense
async function updateExpense() {
  try {
    const id = document.getElementById("updateExpenseId").value.trim();
    requireId(id, "Expense ID");

    const category = document.getElementById("updateCategory").value.trim();
    const amount = document.getElementById("updateAmount").value;
    const rawDate = document.getElementById("updateDate").value;
    const userId = document.getElementById("updateExpenseUserId").value.trim();

    let date = rawDate;
    if (rawDate && rawDate.includes("/")) {
      const parts = rawDate.split("/");
      date = `${parts[2]}-${parts[1]}-${parts[0]}`;
    }

    const expenseData = {};
    if (category) expenseData.category = category;
    if (amount) expenseData.amount = parseFloat(amount);
    if (date) expenseData.date = date;
    if (userId) expenseData.user = { id: parseInt(userId) };

    if (Object.keys(expenseData).length === 0) {
      showResult({ warning: "Nenhum campo para atualizar. Preencha ao menos um campo (category, amount, date ou user ID)." });
      return;
    }

    const res = await fetch(`${baseUrl}/expenses/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(expenseData),
    });

    const handled = await handleResponse(res);
    showResult(handled);
  } catch (err) {
    showResult({ error: err.message });
  }
}

// DELETE expense
async function deleteExpense() {
  try {
    const id = document.getElementById("deleteExpenseId").value.trim();
    requireId(id, "Expense ID");

    const res = await fetch(`${baseUrl}/expenses/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });

    const handled = await handleResponse(res);
    if (res.ok) {
      showResult({ message: `Expense with ID ${id} deleted successfully`, response: handled });
    } else {
      showResult({ error: `Failed to delete expense with ID ${id}`, response: handled });
    }
  } catch (err) {
    showResult({ error: err.message });
  }
}

