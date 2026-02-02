"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import Header from "../../components/Header";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export default function PaymentMethods() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    cardholderName: "",
    cardNumber: "",
    expirationMonth: "",
    expirationYear: "",
    cvv: "",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  // Fetch payment cards
  useEffect(() => {
    if (user) {
      fetchCards();
    }
  }, [user]);

  const fetchCards = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/payment-cards/?supabase_id=${user.id}`
      );
      const data = await response.json();

      if (data.success) {
        setCards(data.cards);
      } else {
        console.error("Failed to fetch cards:", data.error);
      }
    } catch (error) {
      console.error("Error fetching cards:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Format card number with spaces
    if (name === "cardNumber") {
      const cleaned = value.replace(/\s/g, "");
      const formatted = cleaned.match(/.{1,4}/g)?.join(" ") || cleaned;
      setFormData((prev) => ({ ...prev, [name]: formatted }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.cardholderName.trim()) {
      newErrors.cardholderName = "Cardholder name is required";
    }

    const cardNumber = formData.cardNumber.replace(/\s/g, "");
    if (!cardNumber) {
      newErrors.cardNumber = "Card number is required";
    } else if (cardNumber.length < 13 || cardNumber.length > 19) {
      newErrors.cardNumber = "Invalid card number length";
    }

    if (!formData.expirationMonth) {
      newErrors.expirationMonth = "Expiration month is required";
    }

    if (!formData.expirationYear) {
      newErrors.expirationYear = "Expiration year is required";
    }

    if (!formData.cvv) {
      newErrors.cvv = "CVV is required";
    } else if (formData.cvv.length < 3 || formData.cvv.length > 4) {
      newErrors.cvv = "CVV must be 3 or 4 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setFormLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/payment-cards/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          supabase_id: user.id,
          cardholder_name: formData.cardholderName,
          card_number: formData.cardNumber.replace(/\s/g, ""),
          expiration_month: parseInt(formData.expirationMonth),
          expiration_year: parseInt(formData.expirationYear),
          cvv: formData.cvv,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage("Payment card added successfully!");
        setShowAddForm(false);
        setFormData({
          cardholderName: "",
          cardNumber: "",
          expirationMonth: "",
          expirationYear: "",
          cvv: "",
        });
        fetchCards(); // Refresh the list
      } else {
        setErrors({ submit: data.errors || "Failed to add payment card" });
      }
    } catch (error) {
      setErrors({ submit: "Failed to add payment card. Please try again." });
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteCard = async (cardId) => {
    if (!confirm("Are you sure you want to delete this card?")) return;

    try {
      const res = await fetch(
        `${API_BASE_URL}/payment-cards/${cardId}/?supabase_id=${user.id}`,
        { method: "DELETE" }
      );

      // Try to parse JSON, but don't crash if it's not JSON
      let body = null;
      try {
        body = await res.json();
      } catch (_) {
        /* ignore */
      }

      // If server returned an error status, show the message it sent
      if (!res.ok) {
        const msg =
          (body && (body.error || body.message)) ||
          `Failed to delete card (HTTP ${res.status}). Please try again.`;
        alert(msg);
        return;
      }

      // Success path (your backend sends { success: true, ... })
      if (body?.success) {
        setMessage("Payment card deleted successfully!");
        fetchCards(); // refresh
        return;
      }

      // Fallback if body is missing/unexpected
      setMessage("Payment card deleted successfully!");
      fetchCards();
    } catch (err) {
      console.error("Delete card failed:", err);
      alert("Failed to delete card. Please try again.");
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 15 }, (_, i) => currentYear + i);
  const months = [
    { value: 1, label: "01 - January" },
    { value: 2, label: "02 - February" },
    { value: 3, label: "03 - March" },
    { value: 4, label: "04 - April" },
    { value: 5, label: "05 - May" },
    { value: 6, label: "06 - June" },
    { value: 7, label: "07 - July" },
    { value: 8, label: "08 - August" },
    { value: 9, label: "09 - September" },
    { value: 10, label: "10 - October" },
    { value: 11, label: "11 - November" },
    { value: 12, label: "12 - December" },
  ];

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Payment Methods
            </h1>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              {showAddForm ? "Cancel" : "+ Add New Card"}
            </button>
          </div>

          {message && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              {message}
            </div>
          )}

          {/* Add Card Form */}
          {showAddForm && (
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Add New Payment Card
              </h2>

              {errors.submit && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {JSON.stringify(errors.submit)}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="cardholderName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    id="cardholderName"
                    name="cardholderName"
                    value={formData.cardholderName}
                    onChange={handleChange}
                    className={`mt-1 block w-full border ${
                      errors.cardholderName
                        ? "border-red-300"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2`}
                    placeholder="John Doe"
                  />
                  {errors.cardholderName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.cardholderName}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="cardNumber"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Card Number
                  </label>
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    maxLength="19"
                    className={`mt-1 block w-full border ${
                      errors.cardNumber ? "border-red-300" : "border-gray-300"
                    } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2`}
                    placeholder="1234 5678 9012 3456"
                  />
                  {errors.cardNumber && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.cardNumber}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label
                      htmlFor="expirationMonth"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Expiration Month
                    </label>
                    <select
                      id="expirationMonth"
                      name="expirationMonth"
                      value={formData.expirationMonth}
                      onChange={handleChange}
                      className={`mt-1 block w-full border ${
                        errors.expirationMonth
                          ? "border-red-300"
                          : "border-gray-300"
                      } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2`}
                    >
                      <option value="">Month</option>
                      {months.map((month) => (
                        <option key={month.value} value={month.value}>
                          {month.label}
                        </option>
                      ))}
                    </select>
                    {errors.expirationMonth && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.expirationMonth}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="expirationYear"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Expiration Year
                    </label>
                    <select
                      id="expirationYear"
                      name="expirationYear"
                      value={formData.expirationYear}
                      onChange={handleChange}
                      className={`mt-1 block w-full border ${
                        errors.expirationYear
                          ? "border-red-300"
                          : "border-gray-300"
                      } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2`}
                    >
                      <option value="">Year</option>
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                    {errors.expirationYear && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.expirationYear}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="cvv"
                      className="block text-sm font-medium text-gray-700"
                    >
                      CVV
                    </label>
                    <input
                      type="text"
                      id="cvv"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleChange}
                      maxLength="4"
                      className={`mt-1 block w-full border ${
                        errors.cvv ? "border-red-300" : "border-gray-300"
                      } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2`}
                      placeholder="123"
                    />
                    {errors.cvv && (
                      <p className="mt-1 text-sm text-red-600">{errors.cvv}</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading}
                    className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                      formLoading
                        ? "bg-indigo-400 cursor-not-allowed text-white"
                        : "bg-indigo-600 hover:bg-indigo-700 text-white"
                    }`}
                  >
                    {formLoading ? "Adding..." : "Add Card"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Saved Cards */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Saved Cards
            </h2>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading cards...</p>
              </div>
            ) : cards.length === 0 ? (
              <div className="text-center py-8">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
                <p className="mt-2 text-gray-600">No payment cards saved yet</p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Add your first card
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cards.map((card) => (
                  <div
                    key={card.id}
                    className="border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="bg-linear-to-r from-indigo-500 to-purple-600 rounded-lg p-3 text-white">
                        <svg
                          className="h-8 w-8"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {card.brand}
                        </p>
                        <p className="text-gray-600">
                          •••• •••• •••• {card.last_four}
                        </p>
                        <p className="text-sm text-gray-500">
                          {card.cardholder_name}
                        </p>
                        <p className="text-xs text-gray-400">
                          Expires:{" "}
                          {new Date(card.expiration_date).toLocaleDateString(
                            "en-US",
                            { month: "2-digit", year: "numeric" }
                          )}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteCard(card.id)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Security Notice */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex">
              <svg
                className="h-5 w-5 text-blue-400 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Your payment information is secure
                </h3>
                <p className="mt-1 text-sm text-blue-700">
                  All payment card information is encrypted and securely stored.
                  We never share your payment details with third parties.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
