"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Modal from "@/components/Modal";

export default function ForReturn() {
  const [rentals, setRentals] = useState([]);
  const [selectedRental, setSelectedRental] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchReturnedRentals = async () => {
      setLoading(true);
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
      setLoading(false);
    };

    fetchReturnedRentals();
  }, []);

  // ✅ Mark as Returned (Permanently Remove from List)
  // const handleMarkAsReturned = async (id) => {
  //   if (!window.confirm("Are you sure this item has been returned?")) return;

  //   try {
  //     const response = await fetch(`/api/rentals/${id}/return`, {
  //       method: "PATCH",
  //     });

  //     if (response.ok) {
  //       setForReturnItems(forReturnItems.filter((rental) => rental.id !== id));
  //     } else {
  //       console.error("Failed to update return status");
  //     }
  //   } catch (error) {
  //     console.error("Error updating return status:", error);
  //   }
  // };
  const handleMarkAsReturned = async (id) => {
    if (!window.confirm("Are you sure this item has been returned?")) return;

    setActionLoading(true);
    try {
      const response = await fetch(`/api/rentals/${id}/return`, {
        method: "PATCH",
      });

      if (response.ok) {
        setRentals((prevRentals) =>
          prevRentals.filter((rental) => rental.id !== id)
        );
      } else {
        console.error("Failed to update return status");
      }
    } catch (error) {
      console.error("Error updating return status:", error);
    } finally {
      setActionLoading(false);
    }
  };

  // const handleRevertPickup = async (id) => {
  //   if (!confirm("Are you sure you want to revert this rental?")) return;

  //   try {
  //     const response = await fetch(`/api/rentals/${id}/revert-pickup`, {
  //       method: "PATCH",
  //     });

  //     if (response.ok) {
  //       // ✅ Remove from For Return list & refresh UI
  //       setRentals((prevRentals) =>
  //         prevRentals.filter((rental) => rental.id !== id)
  //       );
  //     } else {
  //       console.error("Failed to revert rental pickup status");
  //     }
  //   } catch (error) {
  //     console.error("Error reverting rental pickup status:", error);
  //   }
  // };
  const handleRevertPickup = async (id) => {
    if (!window.confirm("Are you sure you want to revert this rental?")) return;

    setActionLoading(true);
    try {
      const response = await fetch(`/api/rentals/${id}/revert-pickup`, {
        method: "PATCH",
      });

      if (response.ok) {
        setRentals((prevRentals) =>
          prevRentals.filter((rental) => rental.id !== id)
        );
      } else {
        console.error("Failed to revert rental pickup status");
      }
    } catch (error) {
      console.error("Error reverting rental pickup status:", error);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <Navbar />
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center">
        For Return
      </h2>

      {/* Back Button */}
      {/* Back Button */}
      <div className="flex justify-center mb-4">
        <Link href="/" className="text-blue-500 hover:underline">
          ← Back to Home
        </Link>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-lg max-w-3xl mx-auto">
        {loading ? ( // ✅ Show loading indicator
          <div className="flex justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        ) : rentals.length === 0 ? (
          <p className="text-gray-500 text-center">No items for return.</p>
        ) : (
          <ul className="space-y-3">
            {rentals.map((rental) => {
              const today = new Date();
              const returnDate = new Date(rental.returnDate);
              const isOverdue = today > returnDate; // ✅ Check if overdue

              return (
                <li
                  key={rental.id}
                  className="border p-3 rounded bg-gray-50 shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center"
                >
                  {/* Gown Details */}
                  <div className="flex-1 w-full sm:w-auto">
                    <p className="text-lg font-semibold text-gray-800">
                      <strong>Gown:</strong> {rental.gownDesc}
                    </p>
                    <p className="text-gray-600">
                      <strong>Return Date:</strong>{" "}
                      {returnDate.toLocaleDateString()}
                    </p>
                    <p className="text-gray-600">
                      <strong>Status:</strong>{" "}
                      <span
                        className={`font-semibold ${
                          isOverdue ? "text-red-500" : "text-green-500"
                        }`}
                      >
                        {isOverdue ? "Overdue" : "Good"}
                      </span>
                    </p>
                    <p className="text-gray-600">
                      <strong>Name:</strong> {rental.name}
                    </p>
                    <p className="text-gray-600">
                      <strong>Contact:</strong> {rental.contact}
                    </p>
                    <p className="text-gray-600">
                      <strong>Security Deposit:</strong>{" "}
                      {rental.securityDeposit}
                    </p>
                    <p className="text-gray-600">
                      <strong>Notes:</strong> {rental.notes}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2 mt-3 sm:mt-0">
                    <button
                      className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 w-full sm:w-auto"
                      onClick={() => handleRevertPickup(rental.id)}
                      disabled={actionLoading}
                    >
                      {actionLoading ? "Reverting..." : "Back to Not Picked Up"}
                    </button>
                    <button
                      className="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600 w-full sm:w-auto"
                      onClick={() => handleMarkAsReturned(rental.id)}
                      disabled={actionLoading}
                    >
                      {actionLoading ? "Saving..." : "Returned"}
                    </button>
                  </div>
                </li>
              );
            })}
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
