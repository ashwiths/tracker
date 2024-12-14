import React, { useState, useEffect } from "react";
import "./App.css";

// Expense Item Component
const ExpenseItem = ({ expense, onDelete, onEdit }) => {
  return (
    <div className="expense-item">
      <div className="expense-item-info">
        <div>
          <h4 className="expense-name">{expense.name}</h4>
          <p className="expense-category">{expense.category}</p>
        </div>
        <p className="expense-amount">${expense.amount}</p>
      </div>
      <div className="expense-item-actions">
        <button className="btn edit-btn" onClick={() => onEdit(expense)}>
          Edit
        </button>
        <button
          className="btn delete-btn"
          onClick={() => onDelete(expense.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

// Main App Component
function App() {
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({
    id: "",
    name: "",
    amount: "",
    category: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [filterCategory, setFilterCategory] = useState("");

  useEffect(() => {
    const storedExpenses = JSON.parse(localStorage.getItem("expenses")) || [];
    setExpenses(storedExpenses);
  }, []);

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  const handleInputChange = (e) => {
    setNewExpense({ ...newExpense, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newExpense.name && newExpense.amount && newExpense.category) {
      if (isEditing) {
        setExpenses(
          expenses.map((exp) => (exp.id === newExpense.id ? newExpense : exp))
        );
        setIsEditing(false);
      } else {
        setExpenses([
          ...expenses,
          { ...newExpense, id: Date.now().toString() },
        ]);
      }
      setNewExpense({ id: "", name: "", amount: "", category: "" });
    }
  };

  const handleDelete = (id) => {
    setExpenses(expenses.filter((exp) => exp.id !== id));
  };

  const handleEdit = (expense) => {
    setNewExpense(expense);
    setIsEditing(true);
  };

  const handleCategoryChange = (e) => {
    setFilterCategory(e.target.value);
  };

  // Filter expenses by category
  const filteredExpenses = filterCategory
    ? expenses.filter((exp) => exp.category === filterCategory)
    : expenses;

  // Calculate total expenses
  const totalExpense = filteredExpenses.reduce(
    (total, expense) => total + parseFloat(expense.amount),
    0
  );

  return (
    <div className="app-container">
      <h1 className="title">Expense Tracker</h1>

      <div className="expense-summary">
        <h2>Total Expenses: ${totalExpense.toFixed(2)}</h2>
      </div>

      {/* Filter by Category */}
      <div className="filter-container">
        <select
          className="category-filter"
          value={filterCategory}
          onChange={handleCategoryChange}
        >
          <option value="">All Categories</option>
          <option value="Food">Food</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Utilities">Utilities</option>
          <option value="Transport">Transport</option>
        </select>
      </div>

      {/* Expense Form */}
      <form onSubmit={handleSubmit} className="expense-form">
        <input
          type="text"
          name="name"
          value={newExpense.name}
          onChange={handleInputChange}
          placeholder="Expense Name"
          className="expense-input"
        />
        <input
          type="number"
          name="amount"
          value={newExpense.amount}
          onChange={handleInputChange}
          placeholder="Amount"
          className="expense-input"
        />
        <select
          name="category"
          value={newExpense.category}
          onChange={handleInputChange}
          className="expense-input"
        >
          <option value="">Select Category</option>
          <option value="Food">Food</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Utilities">Utilities</option>
          <option value="Transport">Transport</option>
        </select>
        <button className="btn submit-btn" type="submit">
          {isEditing ? "Update Expense" : "Add Expense"}
        </button>
      </form>

      {/* Expense List */}
      <div className="expense-list">
        {filteredExpenses.map((expense) => (
          <ExpenseItem
            key={expense.id}
            expense={expense}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
