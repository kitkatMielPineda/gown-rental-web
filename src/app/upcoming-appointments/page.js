"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function UpcomingAppointments() {
  const [appointments, setAppointments] = useState([]);

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
                <strong>{appointment.name}</strong> - {appointment.contact}
                <br />
                Date: {new Date(appointment.date).toLocaleDateString()}
                <br />
                Time: {new Date(appointment.date).toLocaleTimeString()}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
