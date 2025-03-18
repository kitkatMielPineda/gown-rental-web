"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function UpcomingRentals() {
  const [rentals, setRentals] = useState([]);

  useEffect(() => {
    async function fetchRentals() {
      try {
        const response = await fetch("/api/rentals");
        if (response.ok) {
          const data = await response.json();
          setRentals(data);
        } else {
          console.error("Failed to fetch rentals");
        }
      } catch (error) {
        console.error("Error fetching rentals:", error);
      }
    }

    fetchRentals();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold mb-4 text-center">Upcoming Rentals</h2>

      {/* Back Button */}
      <Link href="/" className="text-blue-500 underline mb-4 inline-block">
        ← Back to Home
      </Link>

      {/* Rentals List */}
      <div className="bg-white p-4 rounded-lg shadow">
        {rentals.length === 0 ? (
          <p className="text-gray-500">No upcoming rentals.</p>
        ) : (
          <ul className="space-y-3">
            {rentals.map((rental) => (
              <li key={rental.id} className="border p-3 rounded">
                <strong>{rental.name}</strong> - Pickup:{" "}
                {new Date(rental.pickupDate).toLocaleDateString()} | Return:{" "}
                {new Date(rental.returnDate).toLocaleDateString()}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
