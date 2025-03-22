import { useState, useEffect } from "react";

export default function AddAppointmentForm({ onAppointmentAdded }) {
  const [appointmentForm, setAppointmentForm] = useState({
    name: "",
    contact: "",
    date: "",
    time: "",
  });

  const [unavailableTimes, setUnavailableTimes] = useState([]);
  const [loading, setLoading] = useState(false);

  const timeSlots = [
    "08:00 AM",
    "08:30 AM",
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "01:00 PM",
    "01:30 PM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:30 PM",
    "04:00 PM",
    "04:30 PM",
    "05:00 PM",
    "05:30 PM",
    "06:00 PM",
    "06:30 PM",
    "07:00 PM",
    "07:30 PM",
    "08:00 PM",
    "08:30 PM",
    "09:00 PM",
    "09:30 PM",
    "10:00 PM",
  ];

  useEffect(() => {
    async function fetchUnavailableTimes() {
      if (!appointmentForm.date) return;

      try {
        const response = await fetch(
          `/api/appointments/unavailable?date=${appointmentForm.date}`
        );
        if (response.ok) {
          const data = await response.json();
          setUnavailableTimes(data);
        } else {
          console.error("Failed to fetch unavailable times");
        }
      } catch (error) {
        console.error("Error fetching unavailable times:", error);
      }
    }

    fetchUnavailableTimes();
  }, [appointmentForm.date]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAppointmentForm({ ...appointmentForm, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const userId = localStorage.getItem("userId");
    const response = await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...appointmentForm, userId }),
    });

    setLoading(false);

    if (response.ok) {
      alert("Appointment saved successfully!");
      if (onAppointmentAdded) onAppointmentAdded(); // ✅ Refresh appointments list
    } else {
      const errorData = await response.json();
      alert(errorData.error || "Failed to save appointment.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={appointmentForm.name}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      />

      <input
        type="text"
        name="contact"
        placeholder="Contact Info"
        value={appointmentForm.contact}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      />

      <input
        type="date"
        name="date"
        value={appointmentForm.date}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      />

      <select
        name="time"
        value={appointmentForm.time}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      >
        <option value="">Select Time</option>
        {timeSlots.map((slot) => (
          <option
            key={slot}
            value={slot}
            disabled={unavailableTimes.includes(slot)}
          >
            {slot}
          </option>
        ))}
      </select>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
      >
        {loading ? "Saving..." : "Save Appointment"}
      </button>
    </form>
  );
}
