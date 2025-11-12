"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Header from "../../components/Header";
import SeatMap from "../../components/SeatMap";
import { useAuth } from "../../contexts/AuthContext";

export default function BookingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  // Store IDs in state to persist them even if searchParams changes
  const [showtimeId, setShowtimeId] = useState(null);
  const [movieId, setMovieId] = useState(null);

  const [showtime, setShowtime] = useState(null);
  const [movie, setMovie] = useState(null);
  const [loadingShowtime, setLoadingShowtime] = useState(true);
  const [loadingMovie, setLoadingMovie] = useState(true);
  const hasLoadedData = useRef(false);

  // Extract IDs from URL on mount and store in state
  useEffect(() => {
    const showtimeParam = searchParams.get("showtimeId");
    const movieParam = searchParams.get("movieId");

    // Only set if we don't already have them and they exist in URL
    if (showtimeParam && movieParam && (!showtimeId || !movieId)) {
      setShowtimeId(showtimeParam);
      setMovieId(movieParam);
    }
  }, [searchParams]);

  const [tickets, setTickets] = useState({
    adult: 0,
    child: 0,
    senior: 0,
  });

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [seatsConfirmed, setSeatsConfirmed] = useState(false);

  const [promoCode, setPromoCode] = useState("");
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState(false);

  const [savedCards, setSavedCards] = useState([]);
  const [selectedCardId, setSelectedCardId] = useState("");
  //helper to know if user has any cards
  const hasSavedCards = savedCards.length > 0;
  const [showNewCardForm, setShowNewCardForm] = useState(false);
  const [loadingCards, setLoadingCards] = useState(false);
  const [newCard, setNewCard] = useState({
    cardholderName: "",
    cardNumber: "",
    expirationMonth: "",
    expirationYear: "",
    cvv: "",
  });

  // Pricing constants (can be adjusted)
  const PRICING = {
    adult: 12.0,
    child: 8.0,
    senior: 10.0,
  };

  useEffect(() => {
    // Only fetch once when component mounts
    if (hasLoadedData.current) return;
    if (!showtimeId || !movieId) return;

    fetchShowtimeDetails(showtimeId);
    fetchMovieDetails(movieId);

    hasLoadedData.current = true;
  }, [showtimeId, movieId]);

  // Fetch saved cards when user is available
  useEffect(() => {
    if (user) {
      fetchSavedCards();
    }
  }, [user]);

  const fetchShowtimeDetails = async (showtimeId) => {
    try {
      setLoadingShowtime(true);
      const response = await fetch(
        `http://127.0.0.1:8000/api/admin/showtimes/${showtimeId}/`
      );
      const data = await response.json();

      if (data.success) {
        setShowtime(data.showtime);
      }
    } catch (error) {
      console.error("Error fetching showtime:", error);
    } finally {
      setLoadingShowtime(false);
    }
  };

  const fetchMovieDetails = async (movieId) => {
    try {
      setLoadingMovie(true);
      const response = await fetch(
        `http://127.0.0.1:8000/api/movies/${movieId}/`
      );
      const data = await response.json();

      // API returns movie data directly, not wrapped in success field
      if (data && data.id) {
        setMovie(data);
      }
    } catch (error) {
      console.error("Error fetching movie:", error);
    } finally {
      setLoadingMovie(false);
    }
  };

  const handleTicketChange = (type, value) => {
    setTickets((prev) => ({
      ...prev,
      [type]: parseInt(value),
    }));
    // Reset seat selection when ticket count changes
    setSelectedSeats([]);
    setSeatsConfirmed(false);
  };

  const handleSeatsSelected = useCallback((seats) => {
    setSelectedSeats(seats);
    // Reset confirmation when seats change
    setSeatsConfirmed(false);
  }, []);

  const handleConfirmSeats = () => {
    if (selectedSeats.length === getTotalTickets()) {
      setSeatsConfirmed(true);
    }
  };

  const validatePromoCode = async () => {
    if (!promoCode.trim()) {
      setPromoError("Please enter a promo code");
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/promotions/validate/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code: promoCode }),
        }
      );

      const data = await response.json();

      if (data.valid) {
        setPromoDiscount(data.discount_percentage);
        setPromoSuccess(true);
        setPromoError("");
      } else {
        setPromoError(data.error || "Invalid promo code");
        setPromoSuccess(false);
        setPromoDiscount(0);
      }
    } catch (error) {
      setPromoError("Failed to validate promo code");
      setPromoSuccess(false);
      setPromoDiscount(0);
    }
  };

  const calculateSubtotal = () => {
    return (
      tickets.adult * PRICING.adult +
      tickets.child * PRICING.child +
      tickets.senior * PRICING.senior
    );
  };

  const calculateDiscount = () => {
    return calculateSubtotal() * (promoDiscount / 100);
  };

  const calculateTotal = () => {
    return calculateSubtotal() - calculateDiscount();
  };

  const getTotalTickets = () => {
    return tickets.adult + tickets.child + tickets.senior;
  };

  const formatShowtime = (datetimeString) => {
    if (!datetimeString) return "";
    const date = new Date(datetimeString);
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

  const fetchSavedCards = async () => {
    if (!user) return;

    try {
      setLoadingCards(true);
      const response = await fetch(
        `http://localhost:8000/api/payment-cards/?supabase_id=${user.id}`
      );
      const data = await response.json();

      if (data.success) {
        setSavedCards(data.cards);
        if (data.cards.length > 0 && !selectedCardId) {
          setSelectedCardId(data.cards[0].id);
        }
      }
    } catch (error) {
      console.error("Error fetching cards:", error);
    } finally {
      setLoadingCards(false);
    }
  };

  const handleNewCardChange = (e) => {
    const { name, value } = e.target;

    if (name === "cardNumber") {
      const cleaned = value.replace(/\s/g, "");
      const formatted = cleaned.match(/.{1,4}/g)?.join(" ") || cleaned;
      setNewCard((prev) => ({ ...prev, [name]: formatted }));
    } else {
      setNewCard((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddNewCard = async () => {
    if (!user) {
      alert("Please sign in to add a payment card");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/payment-cards/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          supabase_id: user.id,
          cardholder_name: newCard.cardholderName,
          card_number: newCard.cardNumber.replace(/\s/g, ""),
          expiration_month: parseInt(newCard.expirationMonth),
          expiration_year: parseInt(newCard.expirationYear),
          cvv: newCard.cvv,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Card added successfully!");
        setShowNewCardForm(false);
        setNewCard({
          cardholderName: "",
          cardNumber: "",
          expirationMonth: "",
          expirationYear: "",
          cvv: "",
        });
        fetchSavedCards();
      } else {
        alert("Failed to add card: " + JSON.stringify(data.errors));
      }
    } catch (error) {
      alert("Failed to add card. Please try again.");
    }
  };

  const handleCompleteBooking = async () => {
    if (!user) {
      alert("Please sign in to complete your booking");
      router.push("/login");
      return;
    }

    if (!seatsConfirmed || selectedSeats.length === 0) {
      alert("Please select and confirm your seats first");
      return;
    }

    // NEW: block purchase if no saved cards
    if (!hasSavedCards) {
      alert("You must add a payment method before booking.");
      router.push("/payment");
      return;
    }

    //check with the boys

    // NEW: ensure a specific card is selected
    //if (!selectedCardId) {
    //  alert("Please select a payment card");
    //  return;
    //}

    try {
      const bookingData = {
        user_id: user.id,
        user_email: user.email,
        showtime_id: showtimeId,
        seat_ids: selectedSeats.map((s) => s.id),
        num_adult_tickets: tickets.adult,
        num_child_tickets: tickets.child,
        num_senior_tickets: tickets.senior,
        total_amount: calculateTotal(),
        payment_card_id: selectedCardId, // required
      };

      const response = await fetch("http://127.0.0.1:8000/api/bookings/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();

      if (data.success) {
        alert(
          `Booking Confirmed!\n\nBooking Number: ${data.booking_number}\n\nA confirmation email has been sent to ${user.email}`
        );
        router.push("/");
      } else {
        alert(`Booking failed: ${data.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error completing booking:", error);
      alert("Failed to complete booking. Please try again.");
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 15 }, (_, i) => currentYear + i);
  const months = [
    { value: 1, label: "01" },
    { value: 2, label: "02" },
    { value: 3, label: "03" },
    { value: 4, label: "04" },
    { value: 5, label: "05" },
    { value: 6, label: "06" },
    { value: 7, label: "07" },
    { value: 8, label: "08" },
    { value: 9, label: "09" },
    { value: 10, label: "10" },
    { value: 11, label: "11" },
    { value: 12, label: "12" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          ← Back to Movies
        </Link>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              Book Your Tickets
            </h1>

            {/* Movie and Showtime Info */}
            {(loadingShowtime || loadingMovie) && !showtime && !movie ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">
                  Loading booking details... (showtime:{" "}
                  {loadingShowtime ? "loading" : "done"}, movie:{" "}
                  {loadingMovie ? "loading" : "done"})
                </p>
              </div>
            ) : showtime && movie ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Booking Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium text-gray-600">Movie:</span>
                    <p className="text-lg text-gray-800">{movie.title}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Showtime:</span>
                    <p className="text-lg text-gray-800">
                      {formatShowtime(showtime.showtime)}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Showroom:</span>
                    <p className="text-lg text-gray-800">
                      {showtime.showroom_name ||
                        `Showroom ${showtime.showroom_id}`}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">
                      Base Price:
                    </span>
                    <p className="text-lg text-gray-800">
                      ${parseFloat(showtime.price).toFixed(2)} per ticket
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
                <p className="text-yellow-800">
                  Showtime information not found. Please select a showtime from
                  the movie page.
                </p>
                <Link
                  href="/"
                  className="text-blue-600 hover:underline mt-2 inline-block"
                >
                  ← Back to Movies
                </Link>
              </div>
            )}

            {/* Payment Method */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Payment Method
              </h3>

              {loadingCards ? (
                <p className="text-sm text-gray-500">
                  Loading payment methods…
                </p>
              ) : hasSavedCards ? (
                <div className="space-y-3">
                  {savedCards.map((c) => (
                    <label
                      key={c.id}
                      className={`flex items-center justify-between border rounded-lg p-3 cursor-pointer ${
                        selectedCardId === c.id
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="paymentCard"
                          value={c.id}
                          checked={selectedCardId === c.id}
                          onChange={() => setSelectedCardId(c.id)}
                          className="h-4 w-4"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{c.brand}</p>
                          <p className="text-sm text-gray-600">
                            •••• •••• •••• {c.last_four}
                          </p>
                          <p className="text-xs text-gray-500">
                            Expires:{" "}
                            {new Date(c.expiration_date).toLocaleDateString(
                              "en-US",
                              { month: "2-digit", year: "numeric" }
                            )}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="text-blue-600 hover:text-blue-800 text-sm underline"
                        onClick={() => router.push("/payment")}
                      >
                        Manage
                      </button>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800">
                    You don’t have a saved payment method yet.
                  </p>
                  <button
                    type="button"
                    className="mt-2 inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                    onClick={() => router.push("/payment")}
                  >
                    Add a Payment Method
                  </button>
                </div>
              )}
            </div>

            {/* Booking Form */}
            {showtime && movie && (
              <form className="space-y-6">
                {/* Ticket Selection */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Select Tickets
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="border border-gray-300 rounded-lg p-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Adult Tickets
                      </label>
                      <p className="text-xs text-gray-500 mb-3">
                        ${PRICING.adult.toFixed(2)} each
                      </p>
                      <select
                        value={tickets.adult}
                        onChange={(e) =>
                          handleTicketChange("adult", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        {[...Array(11)].map((_, i) => (
                          <option key={i} value={i}>
                            {i}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="border border-gray-300 rounded-lg p-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Child Tickets
                      </label>
                      <p className="text-xs text-gray-500 mb-3">
                        ${PRICING.child.toFixed(2)} each (Under 12)
                      </p>
                      <select
                        value={tickets.child}
                        onChange={(e) =>
                          handleTicketChange("child", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        {[...Array(11)].map((_, i) => (
                          <option key={i} value={i}>
                            {i}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="border border-gray-300 rounded-lg p-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Senior Tickets
                      </label>
                      <p className="text-xs text-gray-500 mb-3">
                        ${PRICING.senior.toFixed(2)} each (65+)
                      </p>
                      <select
                        value={tickets.senior}
                        onChange={(e) =>
                          handleTicketChange("senior", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        {[...Array(11)].map((_, i) => (
                          <option key={i} value={i}>
                            {i}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {getTotalTickets() > 0 && (
                    <p className="mt-3 text-sm text-gray-600">
                      Total tickets:{" "}
                      <span className="font-semibold">{getTotalTickets()}</span>
                    </p>
                  )}
                </div>

                {/* Promo Code */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Promo Code
                  </h3>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => {
                        setPromoCode(e.target.value.toUpperCase());
                        setPromoError("");
                        setPromoSuccess(false);
                      }}
                      placeholder="Enter promo code"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    <button
                      type="button"
                      onClick={validatePromoCode}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {promoError && (
                    <p className="mt-2 text-sm text-red-600">{promoError}</p>
                  )}
                  {promoSuccess && (
                    <p className="mt-2 text-sm text-green-600">
                      ✓ Promo code applied! {promoDiscount}% discount
                    </p>
                  )}
                </div>

                {/* Summary */}
                <div className="border-t pt-6 bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Booking Summary
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Movie:</span>
                      <span className="font-medium">{movie?.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Showtime:</span>
                      <span className="font-medium">
                        {formatShowtime(showtime?.showtime)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Showroom:</span>
                      <span className="font-medium">
                        {showtime?.showroom_name ||
                          `Showroom ${showtime?.showroom_id}`}
                      </span>
                    </div>

                    {/* Ticket Breakdown */}
                    {tickets.adult > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>
                          Adult Tickets ({tickets.adult} × $
                          {PRICING.adult.toFixed(2)}):
                        </span>
                        <span>
                          ${(tickets.adult * PRICING.adult).toFixed(2)}
                        </span>
                      </div>
                    )}
                    {tickets.child > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>
                          Child Tickets ({tickets.child} × $
                          {PRICING.child.toFixed(2)}):
                        </span>
                        <span>
                          ${(tickets.child * PRICING.child).toFixed(2)}
                        </span>
                      </div>
                    )}
                    {tickets.senior > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>
                          Senior Tickets ({tickets.senior} × $
                          {PRICING.senior.toFixed(2)}):
                        </span>
                        <span>
                          ${(tickets.senior * PRICING.senior).toFixed(2)}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between border-t pt-2 mt-2">
                      <span>Subtotal:</span>
                      <span>${calculateSubtotal().toFixed(2)}</span>
                    </div>

                    {promoSuccess && promoDiscount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount ({promoDiscount}%):</span>
                        <span>-${calculateDiscount().toFixed(2)}</span>
                      </div>
                    )}

                    <div className="flex justify-between border-t pt-2 mt-2 text-lg">
                      <span className="font-semibold">Total:</span>
                      <span className="font-semibold text-red-600">
                        ${calculateTotal().toFixed(2)}
                      </span>
                    </div>

                    {getTotalTickets() === 0 && (
                      <p className="text-sm text-gray-500 text-center mt-4">
                        Please select at least one ticket
                      </p>
                    )}
                  </div>
                </div>

                {/* Seat Selection - Only show if tickets are selected */}
                {getTotalTickets() > 0 && !seatsConfirmed && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Select Your Seats
                    </h3>
                    <SeatMap
                      key={`seatmap-${getTotalTickets()}`}
                      showtimeId={showtime?.id}
                      maxSeats={getTotalTickets()}
                      onSeatsSelected={handleSeatsSelected}
                      userId={user?.id}
                    />

                    {/* Confirm Seats Button */}
                    {selectedSeats.length === getTotalTickets() && (
                      <div className="mt-6 flex justify-center">
                        <button
                          type="button"
                          className="bg-blue-600 text-white py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
                          onClick={handleConfirmSeats}
                        >
                          Confirm Seat Selection
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Show selected seats after confirmation */}
                {seatsConfirmed && (
                  <div className="mt-8 bg-green-50 border-2 border-green-500 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          ✓ Seats Confirmed
                        </h3>
                        <p className="text-gray-700">
                          <span className="font-medium">Selected Seats:</span>{" "}
                          {selectedSeats.map((s) => s.seat_label).join(", ")}
                        </p>
                      </div>
                      <button
                        type="button"
                        className="text-blue-600 hover:text-blue-800 underline text-sm"
                        onClick={() => setSeatsConfirmed(false)}
                      >
                        Change Seats
                      </button>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6 mt-8">
                  <button
                    type="button"
                    className="flex-1 bg-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-400 transition-colors"
                    onClick={() => router.push(`/movie/${movie?.id}`)}
                  >
                    ← Back to Movie
                  </button>
                  {/*
                  // Complete Booking Button
                  // add "|| !selectedCardId" if boys want it
                  */}
                  <button
                    type="button"
                    disabled={
                      !seatsConfirmed || !hasSavedCards || !selectedCardId
                    }
                    className={`flex-1 py-3 px-6 rounded-lg transition-colors font-medium text-lg ${
                      !seatsConfirmed || !hasSavedCards
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-red-600 text-white hover:bg-red-700"
                    }`}
                    onClick={handleCompleteBooking}
                  >
                    Complete Booking →
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
