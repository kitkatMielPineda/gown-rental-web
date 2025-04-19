"use client";
import { useState, useEffect } from "react";

export default function AddGownModal({ isOpen, onClose }) {
  const [loading, setLoading] = useState(false);
  const [gownTypes, setGownTypes] = useState([]);
  const [gownSizes, setGownSizes] = useState([]);
  const [formData, setFormData] = useState({
    codename: "",
    priceLow: "",
    standardPrice: "",
    color: "",
    description: "",
    types: [],
    sizes: [],
  });

  // 🔁 Load types & sizes when modal opens
  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      try {
        const resType = await fetch("/api/gown-types");
        const resSize = await fetch("/api/gown-sizes");

        const types = await resType.json();
        const sizes = await resSize.json();

        setGownTypes(types);
        setGownSizes(sizes);
      } catch (err) {
        console.error("Failed to load types/sizes:", err);
      }
    };

    fetchData();
  }, [isOpen]);

  const handleCheckboxChange = (field, value) => {
    setFormData((prev) => {
      const selected = prev[field];
      return {
        ...prev,
        [field]: selected.includes(value)
          ? selected.filter((item) => item !== value)
          : [...selected, value],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const response = await fetch("/api/gowns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    setLoading(false);
    onClose();

    if (response.ok) {
      alert("Gown saved!");
    } else {
      const error = await response.json();
      alert(error.error || "Error saving gown");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-xl">
        <h2 className="text-xl font-semibold mb-4">Add New Gown</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Codename"
            className="w-full border p-2 rounded"
            value={formData.codename}
            onChange={(e) =>
              setFormData({ ...formData, codename: e.target.value })
            }
          />

          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Price Low"
              className="w-1/2 border p-2 rounded"
              value={formData.priceLow}
              onChange={(e) =>
                setFormData({ ...formData, priceLow: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Standard Price"
              className="w-1/2 border p-2 rounded"
              value={formData.standardPrice}
              onChange={(e) =>
                setFormData({ ...formData, standardPrice: e.target.value })
              }
            />
          </div>

          <input
            type="text"
            placeholder="Color"
            className="w-full border p-2 rounded"
            value={formData.color}
            onChange={(e) =>
              setFormData({ ...formData, color: e.target.value })
            }
          />

          <textarea
            placeholder="Description"
            className="w-full border p-2 rounded"
            rows={3}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />

          <div>
            <p className="font-medium mb-1">Type of Gown:</p>
            <div className="flex flex-wrap gap-2">
              {gownTypes.map((type) => (
                <label key={type.id} className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    value={type.name}
                    checked={formData.types.includes(type.name)}
                    onChange={() => handleCheckboxChange("types", type.name)}
                  />
                  {type.name}
                </label>
              ))}
            </div>
          </div>

          <div>
            <p className="font-medium mb-1">Sizes:</p>
            <div className="flex flex-wrap gap-2">
              {gownSizes.map((size) => (
                <label key={size.id} className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    value={size.label}
                    checked={formData.sizes.includes(size.label)}
                    onChange={() => handleCheckboxChange("sizes", size.label)}
                  />
                  {size.label}
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600"
              type="submit"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Gown"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
