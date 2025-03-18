"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Modal from "@/components/Modal";

export default function Home() {
  const [isScheduleTypeModalOpen, setIsScheduleTypeModalOpen] = useState(false);
  const [isRentalModalOpen, setIsRentalModalOpen] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isQuickPreviewOpen, setIsQuickPreviewOpen] = useState(false);
  const [quickPreviewRentals, setQuickPreviewRentals] = useState([]);
  const [quickPreviewData, setQuickPreviewData] = useState([]);

  //Rental form data
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

  // Appointment Form State
  const [appointmentForm, setAppointmentForm] = useState({
    name: "",
    contact: "",
    date: "",
    time: "",
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

  const handleAppointmentChange = (e) => {
    const { name, value } = e.target;
    setAppointmentForm({
      ...appointmentForm,
      [name]: value,
    });
  };

  // Handle Rental form submission
  const handleRentalSubmit = async (e) => {
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

  // Handle Appointment Form Submit
  const handleAppointmentSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      alert("User ID is missing. Please log in again.");
      return;
    }

    const appointmentData = { ...appointmentForm, userId };

    const response = await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(appointmentData),
    });

    if (response.ok) {
      alert("Appointment saved successfully!");
      setIsAppointmentModalOpen(false);
      setAppointmentForm({
        name: "",
        contact: "",
        date: "",
        time: "",
      });
    } else {
      const errorData = await response.json();
      alert(errorData.error || "Failed to save appointment.");
    }
  };

  const handleQuickPreview = async () => {
    try {
      // Fetch rentals
      const rentalsResponse = await fetch("/api/rentals");
      const appointmentsResponse = await fetch("/api/appointments");

      if (!rentalsResponse.ok || !appointmentsResponse.ok) {
        console.error("Failed to fetch rentals or appointments");
        return;
      }

      const rentals = await rentalsResponse.json();
      const appointments = await appointmentsResponse.json();

      console.log("Fetched Rentals:", rentals);
      console.log("Fetched Appointments:", appointments);

      const today = new Date();
      const sevenDaysLater = new Date();
      sevenDaysLater.setDate(today.getDate() + 7);

      // Format & merge data
      const formattedRentals = rentals.map((rental) => ({
        type: "Rental",
        date: new Date(rental.pickupDate),
        details: `Rental: ${rental.gownDesc}`,
      }));

      const formattedAppointments = appointments.map((appointment) => ({
        type: "Appointment",
        date: new Date(appointment.date),
        details: `Appointment: ${new Date(appointment.date).toLocaleTimeString(
          "en-US",
          {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }
        )}`,
      }));

      const combinedEvents = [...formattedRentals, ...formattedAppointments]
        .filter((event) => event.date >= today && event.date <= sevenDaysLater)
        .sort((a, b) => a.date - b.date); // Sort by earliest date first

      setQuickPreviewRentals(combinedEvents);
      setIsQuickPreviewOpen(true);
    } catch (error) {
      console.error("Error fetching Quick Preview data:", error);
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
            onClick={() => setIsScheduleTypeModalOpen(true)}
          >
            Add Schedule
          </button>
          <button
            className="bg-green-500 text-white py-3 rounded-lg shadow hover:bg-green-600"
            onClick={() => (window.location.href = "/upcoming-rentals")}
          >
            Upcoming Rentals
          </button>
          <button
            className="bg-yellow-500 text-white py-3 rounded-lg shadow hover:bg-yellow-600"
            onClick={() => (window.location.href = "/upcoming-appointments")}
          >
            Upcoming Appointments
          </button>
          <button
            className="bg-gray-500 text-white py-3 rounded-lg shadow hover:bg-gray-600"
            onClick={handleQuickPreview}
          >
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
      {/* Schedule Type Selection Modal */}
      <Modal
        isOpen={isScheduleTypeModalOpen}
        onClose={() => setIsScheduleTypeModalOpen(false)}
        title="Choose Schedule Type"
      >
        <div className="space-y-4">
          <button
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            onClick={() => {
              setIsScheduleTypeModalOpen(false);
              setIsRentalModalOpen(true);
            }}
          >
            New Rental
          </button>
          <button
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
            onClick={() => {
              setIsScheduleTypeModalOpen(false);
              setIsAppointmentModalOpen(true);
            }}
          >
            New Appointment
          </button>
        </div>
      </Modal>
      {/* Rental Modal */}
      <Modal
        isOpen={isRentalModalOpen}
        onClose={() => setIsRentalModalOpen(false)}
        title="Add New Rental"
      >
        <form onSubmit={handleRentalSubmit} className="space-y-4">
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

      {/* Appointment Modal */}
      <Modal
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
        title="Add New Appointment"
      >
        <form onSubmit={handleAppointmentSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="w-full p-2 border rounded"
            value={appointmentForm.name}
            onChange={handleAppointmentChange}
            required
          />
          <input
            type="text"
            name="contact"
            placeholder="Contact"
            className="w-full p-2 border rounded"
            value={appointmentForm.contact}
            onChange={handleAppointmentChange}
            required
          />
          <input
            type="date"
            name="date"
            className="w-full p-2 border rounded"
            value={appointmentForm.date}
            onChange={handleAppointmentChange}
            required
          />
          <input
            type="time"
            name="time"
            className="w-full p-2 border rounded"
            value={appointmentForm.time}
            onChange={handleAppointmentChange}
            required
          />
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
          >
            Submit
          </button>
        </form>
      </Modal>

      {/* Quick Preview Modal */}
      <Modal
        isOpen={isQuickPreviewOpen}
        onClose={() => setIsQuickPreviewOpen(false)}
        title="Upcoming Rentals & Appointments (Next 7 Days)"
      >
        {quickPreviewRentals.length === 0 ? (
          <p className="text-gray-500">
            No upcoming rentals or appointments in the next 7 days.
          </p>
        ) : (
          <ul className="space-y-2">
            {quickPreviewRentals.map((event, index) => (
              <li key={index} className="border p-3 rounded bg-white shadow">
                {event.type === "Rental" ? (
                  <>
                    <strong>Rental: {event.gownDesc}</strong>
                    <br />
                    <span>Date: {event.date.toLocaleDateString()}</span>
                    <br />
                    <span>For Repair? {event.forRepair ? "Yes" : "No"}</span>
                  </>
                ) : (
                  <>
                    <strong>Appointment: {event.name}</strong>
                    <br />
                    <span>Date: {event.date.toLocaleDateString()}</span>
                    <br />
                    <span>
                      Time:{" "}
                      {event.date.toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </span>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </Modal>
    </div>
  );
}
