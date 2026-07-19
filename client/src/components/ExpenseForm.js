import React, { useState } from "react";
import { addExpense } from "../api";

const CATEGORIES = ["Food", "Transport", "Rent", "Shopping", "Bills", "Entertainment", "Other"];

function ExpenseForm({ onExpenseAdded }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !amount) {
      setError("Please fill in a title and amount.");
      return;
    }

    try {
      await addExpense({
        title: title.trim(),
        amount: Number(amount),
        category,
        date,
      });

      // reset the form
      setTitle("");
      setAmount("");
      setCategory(CATEGORIES[0]);
      setDate(new Date().toISOString().slice(0, 10));

      onExpenseAdded();
    } catch (err) {
      setError("Could not add expense. Is the backend running?");
    }
  };

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      <h2>Add Expense</h2>

      <div className="form-row">
        <label>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Groceries"
        />
      </div>

      <div className="form-row">
        <label>Amount</label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="e.g. 25.50"
        />
      </div>

      <div className="form-row">
        <label>Category</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="form-row">
        <label>Date</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>

      {error && <p className="form-error">{error}</p>}

      <button type="submit">Add Expense</button>
    </form>
  );
}

export default ExpenseForm;
