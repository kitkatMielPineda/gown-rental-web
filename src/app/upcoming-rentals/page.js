"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Modal from "@/components/Modal";
import AddRentalForm from "@/components/AddRentalForm";

export default function UpcomingRentals() {
  const [rentals, setRentals] = useState([]);
  const [selectedRental, setSelectedRental] = useState(null);
  const [editingRental, setEditingRental] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRentalModalOpen, setIsRentalModalOpen] = useState(false);
  const [pickupRental, setPickupRental] = useState(null);
  const [isFinalPaymentModalOpen, setIsFinalPaymentModalOpen] = useState(false);
  const [finalPaymentRental, setFinalPaymentRental] = useState(null);

  const fetchRentals = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/rentals");
      if (response.ok) {
        const data = await response.json();
        const filteredRentals = data.filter((rental) => !rental.isPickedUp);
        setRentals(filteredRentals);
      } else {
        console.error("Failed to fetch rentals", response.json());
      }
    } catch (error) {
      console.error("Error fetching rentals:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRentals();
  }, []);

  const handleUpdateRental = async (id, updatedData) => {
    try {
      const response = await fetch(`/api/rentals/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: updatedData.name,
          contact: updatedData.contact,
          pickupDate: updatedData.pickupDate,
          returnDate: updatedData.returnDate,
          gownDesc: updatedData.gownDesc,
          forRepair: updatedData.forRepair,
          repairDesc: updatedData.repairDesc,
          downPayment: parseFloat(updatedData.downPayment),
          downPaymentMode: updatedData.downPaymentMode,
          totalAmount: parseFloat(updatedData.totalAmount),
          securityDeposit: updatedData.securityDeposit,
          notes: updatedData.notes,
        }),
      });

      if (response.ok) {
        const updatedRental = await response.json();
        setRentals(
          rentals.map((rental) => (rental.id === id ? updatedRental : rental))
        );
        setEditingRental(null); // ✅ Close Modal
      } else {
        console.error("Failed to update rental");
      }
    } catch (error) {
      console.error("Error updating rental:", error);
    }
  };

  const handleMarkAsPickedUp = async (id) => {
    try {
      const response = await fetch(`/api/rentals/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPickedUp: true }), // ✅ Mark as picked up
      });

      if (response.ok) {
        setRentals(rentals.filter((rental) => rental.id !== id)); // ✅ Remove from list
      } else {
        console.error("Failed to update rental status");
      }
    } catch (error) {
      console.error("Error updating rental status:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      {/* Title */}
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center">
        Upcoming Rentals
      </h2>

      {/* Back Button */}
      <div className="flex justify-center mb-4">
        <Link href="/" className="text-blue-500 hover:underline">
          ← Back to Home
        </Link>
      </div>

      {/* Add Rental Button */}
      <div className="flex justify-center mb-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => setIsRentalModalOpen(true)}
        >
          Add New Upcoming Rental
        </button>
      </div>

      {/* Rentals List */}
      <div className="bg-white p-4 rounded-lg shadow-lg max-w-3xl mx-auto">
        {loading ? ( // ✅ Show loading indicator
          <div className="flex justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        ) : rentals.length === 0 ? (
          <p className="text-gray-500 text-center">No upcoming rentals.</p>
        ) : (
          <ul className="space-y-3">
            {rentals.map((rental) => (
              <li
                key={rental.id}
                className="border p-3 rounded bg-gray-50 shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center"
              >
                <div
                  onClick={() => setSelectedRental(rental)}
                  className="flex-1 cursor-pointer w-full sm:w-auto"
                >
                  <p className="text-lg font-semibold text-gray-800">
                    {rental.name}
                  </p>
                  <p className="text-gray-600">
                    <strong>Pickup:</strong>{" "}
                    {new Date(rental.pickupDate).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600">
                    <strong>Return:</strong>{" "}
                    {new Date(rental.returnDate).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600">
                    <strong>Item/s:</strong> {rental.gownDesc}
                  </p>
                  <p className="text-gray-600">
                    <strong>Balance:</strong> ₱
                    {parseFloat(rental.totalAmount) -
                      parseFloat(rental.downPayment)}
                  </p>
                  <p className="text-gray-600">
                    <strong>Notes: </strong> {rental.notes}
                  </p>
                  <p className="text-gray-600">
                    <strong>Security Deposit: </strong> {rental.securityDeposit}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 mt-3 sm:mt-0">
                  <button
                    className="bg-yellow-500 text-white px-3 py-2 rounded hover:bg-yellow-600 w-full sm:w-auto"
                    onClick={() =>
                      setEditingRental({
                        ...rental,
                        securityDeposit: rental.securityDeposit || "",
                        note: rental.note || "",
                      })
                    }
                  >
                    Edit
                  </button>
                  <button
                    className="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600 w-full sm:w-auto"
                    // onClick={(e) => {
                    //   e.stopPropagation(); // Prevent modal from opening
                    //   handleMarkAsPickedUp(rental.id);
                    // }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setFinalPaymentRental(rental);
                      setIsFinalPaymentModalOpen(true);
                    }}
                  >
                    Picked-up / Delivered
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Modal
        isOpen={isRentalModalOpen}
        onClose={() => setIsRentalModalOpen(false)}
        title="Add New Rental"
      >
        <AddRentalForm onRentalAdded={fetchRentals} />
      </Modal>

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
              <strong>Pickup Date:</strong>{" "}
              {new Date(selectedRental.pickupDate).toLocaleDateString()}
            </p>
            <p>
              <strong>Return Date:</strong>{" "}
              {new Date(selectedRental.returnDate).toLocaleDateString()}
            </p>
            <p>
              <strong>Gown Description:</strong> {selectedRental.gownDesc}
            </p>
            <p>
              <strong>For Repair?</strong>{" "}
              {selectedRental.forRepair ? "Yes" : "No"}
            </p>
            <p>
              <strong>Repair Description:</strong> {selectedRental.repairDesc}
            </p>
            <p>
              <strong>Down Payment:</strong> ₱{selectedRental.downPayment}
            </p>
            <p>
              <strong>Down Payment Mode:</strong>{" "}
              {selectedRental.downPaymentMode}
            </p>
            <p>
              <strong>Total Amount:</strong> ₱{selectedRental.totalAmount}
            </p>
            <p>
              <strong>notes:</strong> {selectedRental.notes}
            </p>
          </div>
        )}
      </Modal>

      {/* ✅ Edit Rental Details Modal */}
      <Modal
        isOpen={editingRental !== null}
        onClose={() => setEditingRental(null)}
        title="Edit Rental"
      >
        {editingRental && (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await handleUpdateRental(editingRental.id, editingRental);
              setEditingRental(null); // Close modal
            }}
          >
            <input
              type="text"
              value={editingRental.name}
              onChange={(e) =>
                setEditingRental({ ...editingRental, name: e.target.value })
              }
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="date"
              value={editingRental.pickupDate?.slice(0, 10) || ""}
              onChange={(e) =>
                setEditingRental({
                  ...editingRental,
                  pickupDate: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="date"
              value={editingRental.returnDate?.slice(0, 10) || ""}
              onChange={(e) =>
                setEditingRental({
                  ...editingRental,
                  returnDate: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="text"
              name="contact"
              placeholder="Contact"
              className="w-full p-2 border rounded"
              value={editingRental.contact}
              onChange={(e) =>
                setEditingRental({
                  ...editingRental,
                  contact: e.target.value,
                })
              }
              required
            />
            <input
              type="text"
              name="gownDesc"
              placeholder="Gown Description"
              className="w-full p-2 border rounded"
              value={editingRental.gownDesc}
              onChange={(e) =>
                setEditingRental({
                  ...editingRental,
                  gownDesc: e.target.value,
                })
              }
              required
            />
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="forRepair"
                id="forRepair"
                checked={editingRental.forRepair}
                onChange={(e) =>
                  setEditingRental({
                    ...editingRental,
                    forRepair: e.target.checked, // ✅ Use `checked` instead of `value`
                  })
                }
              />
              <label htmlFor="forRepair">For Repair?</label>
              <input
                type="text"
                name="repairDesc"
                placeholder="repair description"
                className="w-full p-2 border rounded"
                value={editingRental.repairDesc || ""}
                onChange={(e) =>
                  setEditingRental({
                    ...editingRental,
                    repairDesc: e.target.value,
                  })
                }
              />
            </div>
            <input
              type="number"
              name="downPayment"
              placeholder="Down Payment"
              className="w-full p-2 border rounded"
              value={editingRental.downPayment}
              onChange={(e) =>
                setEditingRental({
                  ...editingRental,
                  downPayment: e.target.value,
                })
              }
              required
            />
            <label className="block font-semibold">
              Mode of Payment for Down Payment
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {[
                "GCASH",
                "Maya",
                "GoTyme",
                "BPI",
                "BDO",
                "UnionBank",
                "Metrobank",
                "Cash",
              ].map((mode) => (
                <label key={mode} className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="downPaymentMode"
                    value={mode}
                    checked={editingRental.downPaymentMode === mode}
                    onChange={(e) =>
                      setEditingRental({
                        ...editingRental,
                        downPaymentMode: e.target.value,
                      })
                    }
                    required
                  />
                  {mode}
                </label>
              ))}
            </div>
            <input
              type="number"
              name="totalAmount"
              placeholder="Total Amount"
              className="w-full p-2 border rounded"
              value={editingRental.totalAmount}
              onChange={(e) =>
                setEditingRental({
                  ...editingRental,
                  totalAmount: e.target.value,
                })
              }
              required
            />
            <input
              type="text"
              name="notes"
              placeholder="Notes"
              className="w-full p-2 border rounded"
              value={editingRental.notes || ""}
              onChange={(e) =>
                setEditingRental({
                  ...editingRental,
                  notes: e.target.value,
                })
              }
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 w-full"
            >
              Save Changes
            </button>
          </form>
        )}
      </Modal>

      {isFinalPaymentModalOpen && finalPaymentRental && (
        <Modal
          isOpen={isFinalPaymentModalOpen}
          onClose={() => {
            setIsFinalPaymentModalOpen(false);
            setFinalPaymentRental(null);
          }}
          title="Finalize Payment"
        >
          <form
            onSubmit={async (e) => {
              e.preventDefault();

              const formData = new FormData(e.target);
              const finalPayment = formData.get("finalPayment");
              const finalPaymentMode = formData.get("finalPaymentMode");
              const securityDeposit = formData.get("securityDeposit");

              const response = await fetch(
                `/api/rentals/${finalPaymentRental.id}`,
                {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    finalPayment: parseFloat(finalPayment),
                    finalPaymentMode,
                    securityDeposit,
                    isPickedUp: true,
                  }),
                }
              );

              if (response.ok) {
                fetchRentals();
                setIsFinalPaymentModalOpen(false);
                setFinalPaymentRental(null);
              } else {
                alert("Failed to update rental");
              }
            }}
          >
            <input
              type="number"
              name="finalPayment"
              placeholder="Final Payment"
              required
              className="w-full p-2 border rounded mb-2"
            />

            <label className="block font-semibold">Mode of Payment</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {[
                "GCASH",
                "Maya",
                "GoTyme",
                "BPI",
                "BDO",
                "UnionBank",
                "Metrobank",
                "Cash",
              ].map((mode) => (
                <label key={mode} className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="finalPaymentMode"
                    value={mode}
                    required
                  />
                  {mode}
                </label>
              ))}
            </div>

            <input
              type="text"
              name="securityDeposit"
              placeholder="Security Deposit (optional)"
              className="w-full p-2 border rounded mb-4"
            />

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              Confirm Picked-up / Delivered
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
