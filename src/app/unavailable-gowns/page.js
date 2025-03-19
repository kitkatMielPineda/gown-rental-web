"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function UnavailableGowns() {
  const [unavailableGowns, setUnavailableGowns] = useState([]);

  useEffect(() => {
    const fetchUnavailableGowns = async () => {
      try {
        const response = await fetch("/api/rentals/unavailable");
        if (response.ok) {
          const data = await response.json();
          setUnavailableGowns(data);
        } else {
          console.error("Failed to fetch unavailable gowns");
        }
      } catch (error) {
        console.error("Error fetching unavailable gowns:", error);
      }
    };

    fetchUnavailableGowns();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <Navbar />
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center">
        Unavailable Gowns
      </h2>

      {/* Back Button */}
      <div className="flex justify-center mb-4">
        <Link href="/" className="text-blue-500 hover:underline">
          ← Back to Home
        </Link>
      </div>

      {/* List of Unavailable Gowns */}
      <div className="bg-white p-4 rounded-lg shadow-lg max-w-3xl mx-auto">
        {unavailableGowns.length === 0 ? (
          <p className="text-gray-500 text-center">No unavailable gowns.</p>
        ) : (
          <ul className="space-y-3">
            {unavailableGowns.map((rental) => (
              <li
                key={rental.id}
                className="border p-3 rounded bg-gray-50 shadow-md"
              >
                <p className="text-lg font-semibold text-gray-800">
                  <strong>Gown:</strong> {rental.gownDesc}
                </p>
                <p className="text-gray-600">
                  <strong>Duration:</strong>{" "}
                  {new Date(rental.pickupDate).toLocaleDateString()} -{" "}
                  {new Date(rental.returnDate).toLocaleDateString()}
                </p>
                <p
                  className={`font-semibold ${
                    rental.isPickedUp ? "text-red-500" : "text-green-500"
                  }`}
                >
                  <strong>Status:</strong>{" "}
                  {rental.isPickedUp
                    ? "Currently Rented"
                    : "Upcoming Reservation"}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
