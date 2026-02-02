"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import Header from "../../components/Header";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export default function Profile() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    receivePromotions: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [activeTab, setActiveTab] = useState("profile"); // 'profile' or 'bookings'
  const [savedCards, setSavedCards] = useState([]);
  const [loadingCards, setLoadingCards] = useState(false);

  const { user, updateProfile, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get("tab");
    if (tab === "bookings") {
      setActiveTab("bookings");
    }
  }, []);
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);
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
        setSavedCards(data.cards);
      } else {
        console.error("Failed to fetch cards:", data.error);
      }
    } catch (error) {
      console.error("Error fetching cards:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.user_metadata?.first_name || "",
        lastName: user.user_metadata?.last_name || "",
        email: user.email || "",
        receivePromotions: user.user_metadata?.receive_promotions || false,
      });
      fetchBookings();
      setSavedCards();
    }
  }, [user]);

  const fetchBookings = async () => {
    if (!user) return;

    try {
      setLoadingBookings(true);
      console.log("Fetching bookings for user:", user.id);
      const response = await fetch(
        `${API_BASE_URL}/bookings/user/?user_id=${user.id}`
      );
      const data = await response.json();
      console.log("Bookings response:", data);

      if (data.success) {
        setBookings(data.bookings);
      } else {
        console.error("Bookings fetch failed:", data.error);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoadingBookings(false);
    }
  };

  useEffect(() => {
    if (!user?.id) return;

    const fetchCards = async () => {
      try {
        setLoadingCards(true);

        const response = await fetch(
          `${API_BASE_URL}/payment-cards/?supabase_id=${user.id}`
        );
        const data = await response.json();

        if (data.success) {
          setSavedCards(data.cards);
        } else {
          console.error("Failed to fetch cards:", data.error);
        }
      } catch (error) {
        console.error("Error fetching cards:", error);
      } finally {
        setLoadingCards(false);
      }
    };

    fetchCards();
  }, [user?.id]);

  const formatDateTime = (isoString) => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    return date.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const canCancelBooking = (showtime) => {
    if (!showtime) return false;
    const showtimeDate = new Date(showtime);
    const now = new Date();
    const minutesUntilShowtime = (showtimeDate - now) / (1000 * 60);
    return minutesUntilShowtime > 60; // makes so can cancel if more than 60 minutes before showtime
  };

  const handleCancelBooking = async (bookingId, bookingNumber) => {
    if (
      !confirm(
        `Are you sure you want to cancel booking #${bookingNumber}? You will receive a full refund.`
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/bookings/${bookingId}/cancel/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        alert(
          `Booking cancelled successfully! Refund of $${data.refund_amount.toFixed(
            2
          )} has been processed.`
        );
        fetchBookings();
      } else {
        alert(data.error || "Failed to cancel booking");
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      alert("Failed to cancel booking. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setErrors({});
    setMessage("");

    try {
      const { data, error } = await updateProfile({
        first_name: formData.firstName,
        last_name: formData.lastName,
        receive_promotions: formData.receivePromotions,
      });

      if (error) {
        console.error("Profile update error:", error);
        throw error;
      }

      setMessage("Profile updated successfully!");
      setTimeout(() => {
        setMessage("");
      }, 5000);
    } catch (error) {
      console.error("Profile update caught error:", error);
      setErrors({
        submit: error.message || "Failed to update profile. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`${
                    activeTab === "profile"
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Profile Settings
                </button>
                <button
                  onClick={() => setActiveTab("bookings")}
                  className={`${
                    activeTab === "bookings"
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  My Bookings ({bookings.length})
                </button>
              </nav>
            </div>
          </div>

          {activeTab === "profile" && (
            <div className="max-w-md mx-auto">
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">
                    Profile Settings
                  </h3>

                  {message && (
                    <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                      {message}
                    </div>
                  )}

                  {errors.submit && (
                    <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                      {errors.submit}
                    </div>
                  )}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    
                    <div>
                      <label
                        htmlFor="firstName"
                        className="block text-sm font-medium text-gray-700"
                      >
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="lastName"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        disabled
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500 sm:text-sm px-3 py-2 border"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Email cannot be changed. Contact support if needed.
                      </p>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="receivePromotions"
                        name="receivePromotions"
                        type="checkbox"
                        checked={formData.receivePromotions}
                        onChange={handleChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="receivePromotions"
                        className="ml-2 block text-sm text-gray-900"
                      >
                        Receive promotional emails and special offers
                      </label>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>
                          <strong>Account created:</strong>{" "}
                          {new Date(user.created_at).toLocaleDateString()}
                        </p>
                        <p>
                          <strong>Email confirmed:</strong>{" "}
                          {user.email_confirmed_at ? "Yes" : "No"}
                        </p>
                        {user.last_sign_in_at && (
                          <p>
                            <strong>Last sign in:</strong>{" "}
                            {new Date(
                              user.last_sign_in_at
                            ).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                          loading
                            ? "bg-indigo-400 cursor-not-allowed"
                            : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        }`}
                      >
                        {loading ? "Updating gooeeeeee..." : "Update Profile"}
                      </button>
                    </div>
                  </form>
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h4 className="text-md font-semibold text-gray-900 mb-3">
                      Payment Methods
                    </h4>

                    {loadingCards ? (
                      <p className="text-sm text-gray-500">
                        Loading payment methods…
                      </p>
                    ) : Array.isArray(savedCards) && savedCards.length > 0 ? (
                      <>
                        
                        <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-4">
                          <div>
                            <p className="text-green-800 font-medium">
                              You have {savedCards.length} saved{" "}
                              {savedCards.length === 1 ? "card" : "cards"}.
                            </p>
                            <p className="text-sm text-green-700">
                              Default shown: {savedCards[0].brand} ••••{" "}
                              {savedCards[0].last_four} (exp{" "}
                              {new Date(
                                savedCards[0].expiration_date
                              ).toLocaleDateString("en-US", {
                                month: "2-digit",
                                year: "numeric",
                              })}
                              )
                            </p>
                          </div>
                        </div>

                        
                        <div className="mt-4 space-y-4">
                          {savedCards.map((card) => (
                            <div
                              key={card.id}
                              className="border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:shadow-md transition-shadow"
                            >
                              <div className="flex items-start space-x-4">
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
                                    {new Date(
                                      card.expiration_date
                                    ).toLocaleDateString("en-US", {
                                      month: "2-digit",
                                      year: "numeric",
                                    })}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      
                      <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                          Saved Cards
                        </h2>

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

                          <p className="mt-2 text-gray-600">
                            No payment cards saved yet
                          </p>

                          <button
                            type="button"
                            onClick={() =>
                              router.push("/payment-methods?add=1")
                            }
                            className="mt-4 inline-flex items-center px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                          >
                            Add a Payment Method
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          
          {activeTab === "bookings" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                My Bookings
              </h2>

              {loadingBookings ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading your bookings...</p>
                </div>
              ) : bookings.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <p className="text-gray-600 text-lg">
                    You haven't made any bookings yet.
                  </p>
                  <button
                    onClick={() => router.push("/")}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Browse Movies
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {bookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="bg-white rounded-lg shadow overflow-hidden"
                    >
                      <div className="md:flex">
                        
                        <div className="md:shrink-0">
                          <img
                            className="h-48 w-full object-cover md:w-48"
                            src={booking.poster_url || "/placeholder-movie.jpg"}
                            alt={booking.movie_title}
                          />
                        </div>

                        
                        <div className="p-6 flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-xl font-semibold text-gray-900">
                                {booking.movie_title}
                              </h3>
                              <p className="mt-1 text-sm text-gray-600">
                                Booking #{booking.booking_number}
                              </p>
                            </div>
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${
                                booking.status === "confirmed"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {booking.status}
                            </span>
                          </div>

                          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-600">Showtime</p>
                              <p className="font-medium">
                                {formatDateTime(booking.showtime)}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Theater</p>
                              <p className="font-medium">
                                {booking.showroom_name}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Seats</p>
                              <p className="font-medium">{booking.seats}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Tickets</p>
                              <p className="font-medium">
                                {booking.num_adult_tickets > 0 &&
                                  `${booking.num_adult_tickets} Adult`}
                                {booking.num_child_tickets > 0 &&
                                  `, ${booking.num_child_tickets} Child`}
                                {booking.num_senior_tickets > 0 &&
                                  `, ${booking.num_senior_tickets} Senior`}
                              </p>
                            </div>
                          </div>

                          <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                            <div>
                              <p className="text-sm text-gray-600">Booked on</p>
                              <p className="font-medium">
                                {formatDateTime(booking.booking_date)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-600">
                                Total Amount
                              </p>
                              <p className="text-2xl font-bold text-indigo-600">
                                ${booking.total_amount.toFixed(2)}
                              </p>
                            </div>
                          </div>

                          
                          {booking.status === "confirmed" &&
                            canCancelBooking(booking.showtime) && (
                              <div className="mt-4 pt-4 border-t border-gray-200">
                                <button
                                  onClick={() =>
                                    handleCancelBooking(
                                      booking.id,
                                      booking.booking_number
                                    )
                                  }
                                  className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                                >
                                  Cancel Booking & Get Refund
                                </button>
                                <p className="text-xs text-gray-500 text-center mt-2">
                                  Free cancellation up to 60 minutes before
                                  showtime
                                </p>
                              </div>
                            )}
                          {booking.status === "confirmed" &&
                            !canCancelBooking(booking.showtime) && (
                              <div className="mt-4 pt-4 border-t border-gray-200">
                                <p className="text-sm text-gray-500 text-center">
                                  Cancellation unavailable with less than 60
                                  minutes until showtime.
                                </p>
                              </div>
                            )}
                          {booking.status === "cancelled" && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                              <p className="text-sm text-red-600 text-center font-medium">
                                The booking has been cancelled
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
