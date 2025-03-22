"use client";
import { useState } from "react";

export default function AddRentalForm({ onRentalAdded }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    pickupDate: "",
    returnDate: "",
    gownDesc: "",
    forRepair: false,
    repairDesc: "",
    downPayment: "",
    totalAmount: "",
    securityDeposit: "",
    note: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const userId = localStorage.getItem("userId");

    const response = await fetch("/api/rentals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, userId }),
    });

    setLoading(false);

    if (response.ok) {
      alert("Rental added successfully!");
      onRentalAdded(); // refetch rentals in parent
    } else {
      const err = await response.json();
      alert(err.error || "Failed to add rental");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-4 rounded shadow"
    >
      <input
        className="w-full p-2 border rounded"
        name="name"
        placeholder="Name"
        required
        value={formData.name}
        onChange={handleChange}
      />
      <input
        className="w-full p-2 border rounded"
        name="contact"
        placeholder="Contact"
        required
        value={formData.contact}
        onChange={handleChange}
      />
      <input
        className="w-full p-2 border rounded"
        name="pickupDate"
        type="date"
        required
        value={formData.pickupDate}
        onChange={handleChange}
      />
      <input
        className="w-full p-2 border rounded"
        name="returnDate"
        type="date"
        required
        value={formData.returnDate}
        onChange={handleChange}
      />
      <input
        className="w-full p-2 border rounded"
        name="gownDesc"
        placeholder="Gown Description"
        required
        value={formData.gownDesc}
        onChange={handleChange}
      />
      <div className="flex gap-2 items-center">
        <input
          type="checkbox"
          name="forRepair"
          checked={formData.forRepair}
          onChange={handleChange}
        />
        <label>For Repair?</label>
      </div>
      <input
        className="w-full p-2 border rounded"
        name="repairDesc"
        placeholder="Repair Description (optional)"
        value={formData.repairDesc}
        onChange={handleChange}
      />
      <input
        className="w-full p-2 border rounded"
        name="downPayment"
        type="number"
        placeholder="Down Payment"
        required
        value={formData.downPayment}
        onChange={handleChange}
      />
      <input
        className="w-full p-2 border rounded"
        name="totalAmount"
        type="number"
        placeholder="Total Amount"
        required
        value={formData.totalAmount}
        onChange={handleChange}
      />
      <input
        className="w-full p-2 border rounded"
        name="securityDeposit"
        placeholder="Security Deposit"
        value={formData.securityDeposit}
        onChange={handleChange}
      />
      <input
        className="w-full p-2 border rounded"
        name="note"
        placeholder="Notes (optional)"
        value={formData.note}
        onChange={handleChange}
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600"
        type="submit"
        disabled={loading}
      >
        {loading ? "Saving..." : "Save Rental"}
      </button>
    </form>
  );
}
