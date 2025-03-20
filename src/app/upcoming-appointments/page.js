"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import Modal from "@/components/Modal";

export default function UpcomingAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [unavailableTimes, setUnavailableTimes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
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
      setLoading(false);
    };

    fetchAppointments();
  }, []);

  useEffect(() => {
    async function fetchUnavailableTimes() {
      if (!editingAppointment || !editingAppointment.date) return;

      try {
        const response = await fetch(
          `/api/appointments/unavailable?date=${editingAppointment.date}`
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
  }, [editingAppointment?.date]);

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
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <Navbar />
      <div className="container mx-auto p-6">
        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center">
          Upcoming Appointments
        </h2>

        {/* Back Button */}
        <div className="flex justify-center mb-4">
          <Link href="/" className="text-blue-500 hover:underline">
            ← Back to Home
          </Link>
        </div>

        {/* List of Upcoming Appointments */}
        <div className="bg-white p-4 rounded-lg shadow-lg max-w-3xl mx-auto">
          {loading ? ( // ✅ Show loading indicator
            <div className="flex justify-center">
              <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
          ) : appointments.length === 0 ? (
            <p className="text-gray-500 text-center">
              No upcoming appointments.
            </p>
          ) : (
            <ul className="space-y-3">
              {appointments.map((appointment) => (
                <li
                  key={appointment.id}
                  className="border p-3 rounded bg-gray-50 shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center"
                >
                  {/* Appointment Details */}
                  <div className="flex-1 w-full sm:w-auto">
                    <p className="text-lg font-semibold text-gray-800">
                      {appointment.name}
                    </p>
                    <p className="text-gray-600">
                      <strong>Contact:</strong> {appointment.contact}
                    </p>
                    <p className="text-gray-600">
                      <strong>Date:</strong>{" "}
                      {new Date(appointment.date).toLocaleDateString()}
                    </p>
                    <p className="text-gray-600">
                      <strong>Time:</strong> {appointment.time}
                    </p>
                  </div>
                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2 mt-3 sm:mt-0">
                    <button
                      className="bg-yellow-500 text-white px-3 py-2 rounded hover:bg-yellow-600 w-full sm:w-auto"
                      onClick={() =>
                        setEditingAppointment({
                          ...appointment,
                          date: "", // Empty date
                          time: "", // Empty time
                        })
                      }
                    >
                      Edit
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
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
