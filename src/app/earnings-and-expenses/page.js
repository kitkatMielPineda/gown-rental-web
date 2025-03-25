"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function EarningsAndExpensesPage() {
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);

  const paymentModes = [
    "GCASH",
    "Maya",
    "GoTyme",
    "BPI",
    "BDO",
    "UnionBank",
    "Metrobank",
    "Cash",
  ];

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const response = await fetch("/api/earnings-and-expenses");
        const data = await response.json();
        setSummary(data);
      } catch (error) {
        console.error("Failed to fetch summary:", error);
      }
      setLoading(false);
    }

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">
        Monthly Earnings & Expenses
      </h2>

      {/* Back Button */}
      <div className="flex justify-center mb-4">
        <Link href="/" className="text-blue-500 hover:underline">
          ← Back to Home
        </Link>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : summary.length === 0 ? (
        <p className="text-center text-gray-500">No data available.</p>
      ) : (
        [...summary]
          .sort(
            (a, b) =>
              new Date(a.monthKey + "-01") - new Date(b.monthKey + "-01")
          )
          .map(({ monthLabel, breakdown, totalEarnings }) => (
            <div key={monthLabel} className="mb-10">
              <h3 className="text-xl font-semibold mb-2">{monthLabel}</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-md rounded">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="py-2 px-4 border">Bank</th>
                      <th className="py-2 px-4 border">Earnings</th>
                      <th className="py-2 px-4 border">Expenses</th>
                      <th className="py-2 px-4 border">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paymentModes.map((mode) => {
                      const { earnings = 0, expenses = 0 } =
                        breakdown[mode] || {};
                      const net = earnings - expenses;

                      return (
                        <tr key={mode}>
                          <td className="py-2 px-4 border">{mode}</td>
                          <td className="py-2 px-4 border">
                            ₱{earnings.toLocaleString()}
                          </td>
                          <td className="py-2 px-4 border">
                            ₱{expenses.toLocaleString()}
                          </td>
                          <td className="py-2 px-4 border">
                            ₱{net.toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p className="mt-2 text-right font-semibold">
                Total Earnings: ₱{totalEarnings.toLocaleString()}
              </p>
            </div>
          ))
      )}
    </div>
  );
}
