"use client";
import { useState } from "react";

export default function PickupConfirmationModal({
  rental,
  onConfirm,
  onClose,
}) {
  const [finalPayment, setFinalPayment] = useState("");
  const [finalPaymentMode, setFinalPaymentMode] = useState("");
  const [securityDeposit, setSecurityDeposit] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm({
      finalPayment: parseFloat(finalPayment),
      finalPaymentMode,
      securityDeposit,
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Confirm Pickup / Delivery
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Final Payment</label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              value={finalPayment}
              onChange={(e) => setFinalPayment(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block font-medium">Final Payment Mode</label>
            <div className="grid grid-cols-2 gap-2">
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
                <label key={mode} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="finalPaymentMode"
                    value={mode}
                    checked={finalPaymentMode === mode}
                    onChange={(e) => setFinalPaymentMode(e.target.value)}
                    required
                  />
                  <span>{mode}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-medium">Security Deposit</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={securityDeposit}
              onChange={(e) => setSecurityDeposit(e.target.value)}
            />
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
