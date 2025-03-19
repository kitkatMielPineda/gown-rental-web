"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import Modal from "@/components/Modal";

export default function UpcomingAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [unavailableTimes, setUnavailableTimes] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch("/api/appointments");
        const data = await response.json();

        console.log("Fetched Appointments:", data); // ✅ Debugging: Log the fetched data

        if (response.ok) {
          setAppointments(data);
        } else {
          console.error("Failed to fetch appointments:", data.error);
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, []);

  useEffect(() => {
    async function fetchUnavailableTimes() {
      if (!editingAppointment || !editingAppointment.date) return; // Prevent errors

      try {
        const response = await fetch(
          `/api/appointments?date=${editingAppointment.date}`
        );
        if (response.ok) {
          const data = await response.json();
          const takenTimes = data.map((appointment) => appointment.time);
          setUnavailableTimes(takenTimes);
        }
      } catch (error) {
        console.error("Error fetching unavailable times:", error);
      }
    }

    fetchUnavailableTimes();
  }, [editingAppointment?.date]); // ✅ Now updates when date changes

  const handleUpdateAppointment = async (id, updatedData) => {
    try {
      // ✅ Ensure correct Date format before sending to API
      const formattedData = {
        ...updatedData,
        date: new Date(updatedData.date), // Convert string to Date object
      };

      const response = await fetch(`/api/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      });

      if (response.ok) {
        const updatedAppointment = await response.json();
        setAppointments(
          appointments.map((appt) =>
            appt.id === id ? updatedAppointment : appt
          )
        );
        setEditingAppointment(null); // Close modal after saving
      } else {
        console.error("Failed to update appointment");
      }
    } catch (error) {
      console.error("Error updating appointment:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto p-6">
        <h2 className="text-3xl font-bold mb-4 text-center">
          Upcoming Appointments
        </h2>

        {/* Back Button */}
        <Link href="/" className="text-blue-500 underline mb-4 inline-block">
          ← Back to Home
        </Link>

        {/* List of Upcoming Appointments */}
        {appointments.length === 0 ? (
          <p className="text-gray-500 text-center">No upcoming appointments.</p>
        ) : (
          <ul className="space-y-2">
            {appointments.map((appointment) => (
              <li
                key={appointment.id}
                className="border p-3 rounded bg-white shadow"
              >
                <div className="flex-1">
                  <strong>{appointment.name}</strong> - {appointment.contact}
                  <br />
                  Date: {new Date(appointment.date).toLocaleDateString()}
                  <br />
                  Time: {appointment.time}
                </div>
                <button
                  className="bg-yellow-500 text-white px-3 py-2 rounded hover:bg-yellow-600 ml-2"
                  onClick={() => setEditingAppointment(appointment)}
                >
                  Edit
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* ✅ Edit Appointment Modal */}
      <Modal
        isOpen={editingAppointment !== null}
        onClose={() => setEditingAppointment(null)}
        title="Edit Appointment"
      >
        {editingAppointment && (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await handleUpdateAppointment(
                editingAppointment.id,
                editingAppointment
              );
            }}
            className="space-y-4"
          >
            <input
              type="text"
              value={editingAppointment.name}
              onChange={(e) =>
                setEditingAppointment({
                  ...editingAppointment,
                  name: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="text"
              value={editingAppointment.contact}
              onChange={(e) =>
                setEditingAppointment({
                  ...editingAppointment,
                  contact: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="date"
              value={editingAppointment.date.split("T")[0]} // Format Date
              onChange={(e) =>
                setEditingAppointment({
                  ...editingAppointment,
                  date: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
              required
            />
            <select
              name="time"
              className="w-full p-2 border rounded"
              value={editingAppointment.time}
              onChange={(e) =>
                setEditingAppointment({
                  ...editingAppointment,
                  time: e.target.value,
                })
              }
              required
            >
              <option value="">Select Time</option>
              {[
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
              ].map((slot) => (
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
              className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 w-full"
            >
              Save Changes
            </button>
          </form>
        )}
      </Modal>
    </div>
  );
}
