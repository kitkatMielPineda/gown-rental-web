"use client";
import { useState, useEffect } from "react";
import AddGownModal from "@/components/AddGownModal";
import Link from "next/link";
import EditGownModal from "@/components/EditGownModal";

export default function GownListPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedGown, setSelectedGown] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [gowns, setGowns] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const fetchGowns = async () => {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    });
    if (search) params.append("search", search);
    if (type) params.append("type", type);
    if (size) params.append("size", size);
    if (color) params.append("color", color);

    const res = await fetch(`/api/gowns?${params.toString()}`);
    const data = await res.json();
    setGowns(data.gowns);
    setTotal(data.total);
  };

  useEffect(() => {
    fetchGowns();
  }, [page, search, type, size, color]);

  const totalPages = Math.ceil(total / pageSize);

  const handleDeleteGown = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this gown?"
    );
    if (!confirm) return;

    const res = await fetch(`/api/gowns/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      alert("Gown deleted successfully!");
      fetchGowns(); // Refresh the list
    } else {
      alert("Failed to delete gown.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center">
        List of Gowns
      </h2>

      <div className="flex justify-center mb-4">
        <Link href="/" className="text-blue-500 hover:underline">
          ← Back to Home
        </Link>
      </div>

      <div className="flex justify-center mb-4">
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Add Gown
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Search by Codename"
          className="border p-2 rounded w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border p-2 rounded w-full"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="">All Types</option>
          {[
            "Ball Gown",
            "Mermaid/Trumpet",
            "A-Line",
            "Bridgerton",
            "Longtrain Prenup",
            "With Train",
          ].map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        <select
          className="border p-2 rounded w-full"
          value={size}
          onChange={(e) => setSize(e.target.value)}
        >
          <option value="">All Sizes</option>
          {["XS", "Small", "Medium", "Large", "XL", "2XL", "3XL", "kids"].map(
            (s) => (
              <option key={s}>{s}</option>
            )
          )}
        </select>
        <input
          type="text"
          placeholder="Filter by Color"
          className="border p-2 rounded w-full"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
      </div>

      {/* Gown Table */}
      {/* <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full table-auto">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 text-left">Codename</th>
              <th className="p-2 text-left">Color</th>
              <th className="p-2 text-left">Types</th>
              <th className="p-2 text-left">Sizes</th>
              <th className="p-2 text-left">Price Range</th>
            </tr>
          </thead>
          <tbody>
            {gowns.map((gown) => (
              <tr key={gown.id} className="border-t">
                <td className="p-2">{gown.codename}</td>
                <td className="p-2">{gown.color}</td>
                <td className="p-2">
                  {gown.types.map((t) => t.name).join(", ")}
                </td>
                <td className="p-2">
                  {gown.sizes.map((s) => s.label).join(", ")}
                </td>
                <td className="p-2">
                  ₱{gown.priceLow} - ₱{gown.standardPrice}
                </td>
                <td className="p-2 flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedGown(gown);
                      setEditOpen(true);
                    }}
                    className="px-2 py-1 bg-yellow-500 text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteGown(gown.id)}
                    className="px-2 py-1 bg-red-600 text-white rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> */}

      {/* Gown Cards */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {gowns.map((gown) => (
          <div
            key={gown.id}
            className="bg-white p-4 rounded shadow hover:shadow-md transition"
          >
            <h3 className="text-lg font-bold mb-1">{gown.codename}</h3>
            <p className="text-sm text-gray-600 mb-1">Color: {gown.color}</p>
            <p className="text-sm text-gray-600 mb-1">
              Types: {gown.types.map((t) => t.name).join(", ")}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              Sizes: {gown.sizes.map((s) => s.label).join(", ")}
            </p>
            <p className="text-sm text-gray-800 font-semibold">
              ₱{gown.priceLow} - ₱{gown.standardPrice}
            </p>

            <div className="mt-3 flex justify-end gap-2">
              <button
                onClick={() => {
                  setSelectedGown(gown);
                  setEditOpen(true);
                }}
                className="px-2 py-1 bg-yellow-500 text-white rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteGown(gown.id)}
                className="text-sm px-3 py-1 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-center gap-2">
        {Array.from({ length: totalPages }).map((_, idx) => (
          <button
            key={idx + 1}
            className={`px-3 py-1 border rounded ${
              page === idx + 1 ? "bg-blue-500 text-white" : ""
            }`}
            onClick={() => setPage(idx + 1)}
          >
            {idx + 1}
          </button>
        ))}
      </div>

      <AddGownModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <EditGownModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        gown={selectedGown}
        onGownUpdated={fetchGowns}
      />
    </div>
  );
}
