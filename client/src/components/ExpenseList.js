import React from "react";
import { deleteExpense } from "../api";

function ExpenseList({ expenses, onExpenseDeleted }) {
  const handleDelete = async (id) => {
    await deleteExpense(id);
    onExpenseDeleted();
  };

  return (
    <div className="expense-list">
      <h2>Recent Expenses</h2>
      {expenses.length === 0 && <p>No expenses yet. Add one to get started.</p>}

      <ul>
        {expenses.slice(0, 10).map((exp) => (
          <li key={exp._id}>
            <div>
              <strong>{exp.title}</strong>
              <span className="tag">{exp.category}</span>
              <div className="expense-date">
                {new Date(exp.date).toLocaleDateString()}
              </div>
            </div>
            <div className="expense-right">
              <span className="amount">${exp.amount.toFixed(2)}</span>
              <button onClick={() => handleDelete(exp._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ExpenseList;
