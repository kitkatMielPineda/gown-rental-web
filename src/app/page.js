"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Modal from "@/components/Modal";

export default function Home() {
  const [isRentalModalOpen, setIsRentalModalOpen] = useState(false);
  const [userId, setUserId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    pickupDate: "",
    returnDate: "",
    gownDesc: "",
    forRepair: false,
    downPayment: "",
    totalAmount: "",
    user: { id: null },
  });

  // ✅ Retrieve userId when component mounts
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
      setFormData((prevData) => ({ ...prevData, user: { id: storedUserId } }));
    }
  }, []);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Get user token from localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to rent a gown.");
      return;
    }

    // Decode userId from the token (assuming backend sends userId inside the JWT)
    const userId = localStorage.getItem("userId"); // Assuming you store userId after login

    if (!userId) {
      alert("User ID is missing. Please log in again.");
      return;
    }

    const rentalData = {
      ...formData,
      userId, // ✅ Attach userId
    };

    const response = await fetch("/api/rentals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rentalData),
    });

    if (response.ok) {
      alert("Rental saved successfully!");
      setIsRentalModalOpen(false);
      setFormData({
        name: "",
        contact: "",
        pickupDate: "",
        returnDate: "",
        gownDesc: "",
        forRepair: false,
        downPayment: "",
        totalAmount: "",
      });
    } else {
      const errorData = await response.json();
      alert(errorData.error || "Failed to save rental.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto p-6">
        <h2 className="text-3xl font-bold mb-4 text-center">
          Welcome to Gown Rental
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
          <button
            className="bg-blue-500 text-white py-3 rounded-lg shadow hover:bg-blue-600"
            onClick={() => setIsRentalModalOpen(true)}
          >
            Add Schedule
          </button>
          <button className="bg-green-500 text-white py-3 rounded-lg shadow hover:bg-green-600">
            Upcoming Rentals
          </button>
          <button className="bg-yellow-500 text-white py-3 rounded-lg shadow hover:bg-yellow-600">
            Upcoming Appointments
          </button>
          <button className="bg-gray-500 text-white py-3 rounded-lg shadow hover:bg-gray-600">
            Quick Preview
          </button>
          <button className="bg-red-500 text-white py-3 rounded-lg shadow hover:bg-red-600">
            Notifications
          </button>
          <button className="bg-purple-500 text-white py-3 rounded-lg shadow hover:bg-purple-600">
            Unavailable Gowns
          </button>
        </div>
      </div>
      {/* Rental Modal */}
      <Modal
        isOpen={isRentalModalOpen}
        onClose={() => setIsRentalModalOpen(false)}
        title="Add New Rental"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="w-full p-2 border rounded"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="contact"
            placeholder="Contact"
            className="w-full p-2 border rounded"
            value={formData.contact}
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name="pickupDate"
            className="w-full p-2 border rounded"
            value={formData.pickupDate}
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name="returnDate"
            className="w-full p-2 border rounded"
            value={formData.returnDate}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="gownDesc"
            placeholder="Gown Description"
            className="w-full p-2 border rounded"
            value={formData.gownDesc}
            onChange={handleChange}
            required
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="forRepair"
              id="forRepair"
              checked={formData.forRepair}
              onChange={handleChange}
            />
            <label htmlFor="forRepair">For Repair?</label>
          </div>
          <input
            type="number"
            name="downPayment"
            placeholder="Down Payment"
            className="w-full p-2 border rounded"
            value={formData.downPayment}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="totalAmount"
            placeholder="Total Amount"
            className="w-full p-2 border rounded"
            value={formData.totalAmount}
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Submit
          </button>
        </form>
      </Modal>
    </div>
  );
}
