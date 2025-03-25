"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    amount: "",
    paymentMode: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  const fetchExpenses = async () => {
    try {
      const res = await fetch("/api/expenses");
      const data = await res.json();
      setExpenses(data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const method = formData.id ? "PATCH" : "POST";
    const url = formData.id ? `/api/expenses/${formData.id}` : "/api/expenses";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      setFormData({ date: "", amount: "", paymentMode: "", description: "" });
      setIsModalOpen(false);
      fetchExpenses();
    } else {
      alert("Failed to save expense.");
    }
    setLoading(false);
  };

  const paymentModes = [
    "GCASH",
    "Maya",
    "GoTyme",
    "BPI",
    "BDO",
    "UnionBank",
    "Metrobank",
    "Cash",
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold mb-4 text-center">Expenses</h2>

      {/* Back Button */}
      <div className="flex justify-center mb-4">
        <Link href="/" className="text-blue-500 hover:underline">
          ← Back to Home
        </Link>
      </div>

      <div className="flex justify-center mb-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => setIsModalOpen(true)}
        >
          Add Expense
        </button>
      </div>

      {isModalOpen && (
        <div className="bg-white shadow rounded-lg p-6 max-w-xl mx-auto mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
            <input
              type="number"
              name="amount"
              placeholder="Amount"
              value={formData.amount}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
            <select
              name="paymentMode" // ✅ was "mode"
              value={formData.paymentMode}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            >
              <option value="">Select Mode of Expense</option>
              {paymentModes.map((mode) => (
                <option key={mode} value={mode}>
                  {mode}
                </option>
              ))}
            </select>
            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Expense"}
            </button>
            <button
              type="button"
              className="w-full text-red-500 mt-2"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* ✅ List of Expenses */}
      <div className="bg-white shadow rounded-lg p-4 max-w-3xl mx-auto">
        {expenses.length === 0 ? (
          <p className="text-center text-gray-500">No expenses recorded.</p>
        ) : (
          <ul className="divide-y">
            {expenses.map((expense) => (
              <li key={expense.id} className="py-3">
                <p className="text-sm text-gray-600">
                  <strong>Date:</strong>{" "}
                  {new Date(expense.createdAt).toLocaleDateString()}
                </p>
                <p>
                  <strong>Amount:</strong> ₱{expense.amount}
                </p>
                <p>
                  <strong>Mode:</strong> {expense.paymentMode}
                </p>
                <p>
                  <strong>Description:</strong> {expense.description}
                </p>

                <button
                  onClick={() => {
                    setFormData({
                      id: expense.id, // include ID for editing
                      date: expense.createdAt?.split("T")[0] || "", // just the YYYY-MM-DD
                      amount: expense.amount,
                      paymentMode: expense.paymentMode,
                      description: expense.description,
                    });
                    setIsModalOpen(true);
                  }}
                  className="text-blue-500 hover:underline text-sm mt-1"
                >
                  Edit
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
