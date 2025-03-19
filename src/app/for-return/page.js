"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Modal from "@/components/Modal";

export default function ForReturn() {
  const [rentals, setRentals] = useState([]);
  const [selectedRental, setSelectedRental] = useState(null);

  useEffect(() => {
    const fetchReturnedRentals = async () => {
      try {
        const response = await fetch("/api/rentals");
        if (response.ok) {
          const data = await response.json();
          // ✅ Only show rentals that are picked up but not yet returned
          const filteredRentals = data.filter(
            (rental) => rental.isPickedUp && !rental.isReturned
          );
          setRentals(filteredRentals);
        } else {
          console.error("Failed to fetch rentals");
        }
      } catch (error) {
        console.error("Error fetching rentals:", error);
      }
    };

    fetchReturnedRentals();
  }, []);

  // ✅ Mark as Returned (Permanently Remove from List)
  const handleMarkAsReturned = async (id) => {
    if (!window.confirm("Are you sure this item has been returned?")) return;

    try {
      const response = await fetch(`/api/rentals/${id}/return`, {
        method: "PATCH",
      });

      if (response.ok) {
        setForReturnItems(forReturnItems.filter((rental) => rental.id !== id));
      } else {
        console.error("Failed to update return status");
      }
    } catch (error) {
      console.error("Error updating return status:", error);
    }
  };

  const handleRevertPickup = async (id) => {
    if (!confirm("Are you sure you want to revert this rental?")) return;

    try {
      const response = await fetch(`/api/rentals/${id}/revert-pickup`, {
        method: "PATCH",
      });

      if (response.ok) {
        // ✅ Remove from For Return list & refresh UI
        setRentals((prevRentals) =>
          prevRentals.filter((rental) => rental.id !== id)
        );
      } else {
        console.error("Failed to revert rental pickup status");
      }
    } catch (error) {
      console.error("Error reverting rental pickup status:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Navbar />
      <h2 className="text-3xl font-bold mb-4 text-center">For Return</h2>

      {/* Back Button */}
      <Link href="/" className="text-blue-500 underline mb-4 inline-block">
        ← Back to Home
      </Link>

      <div className="bg-white p-4 rounded-lg shadow">
        {rentals.length === 0 ? (
          <p className="text-gray-500 text-center">No items for return.</p>
        ) : (
          <ul className="space-y-3">
            {rentals.map((rental) => (
              <li
                key={rental.id}
                className="border p-3 rounded flex justify-between items-center"
              >
                <div className="flex-1">
                  <strong>Gown:</strong> {rental.gownDesc}
                  <br />
                  <strong>Return Date:</strong>{" "}
                  {new Date(rental.returnDate).toLocaleDateString()}
                  <br />
                  <strong>Name:</strong> {rental.name}
                  <br />
                  <strong>Contact:</strong> {rental.contact}
                </div>

                <button
                  className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 ml-2"
                  onClick={() => handleRevertPickup(rental.id)}
                >
                  Back to Not Picked Up
                </button>

                <button
                  className="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600 ml-2"
                  onClick={() => handleMarkAsReturned(rental.id)}
                >
                  Done
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ✅ Rental Details Modal */}
      <Modal
        isOpen={selectedRental !== null}
        onClose={() => setSelectedRental(null)}
        title="Rental Details"
      >
        {selectedRental && (
          <div className="space-y-2">
            <p>
              <strong>Name:</strong> {selectedRental.name}
            </p>
            <p>
              <strong>Contact:</strong> {selectedRental.contact}
            </p>
            <p>
              <strong>Return Date:</strong>{" "}
              {new Date(selectedRental.returnDate).toLocaleDateString()}
            </p>
            <p>
              <strong>Gown Description:</strong> {selectedRental.gownDesc}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}
