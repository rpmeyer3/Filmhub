"use client";
import { useState, useEffect } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export default function SeatMap({
  showtimeId,
  maxSeats,
  onSeatsSelected,
  userId,
}) {
  const [seats, setSeats] = useState([]);
  const [layout, setLayout] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (showtimeId) {
      fetchSeats();
    }
  }, [showtimeId, userId]);
  useEffect(() => {
    setSelectedSeats([]);
  }, [maxSeats]);

  useEffect(() => {
    // need a logged in user and a showtime to hold seats
    if (!userId || !showtimeId) return;

    const seatIds = selectedSeats.map((s) => s.id);
    if (seatIds.length === 0) return;

    const controller = new AbortController();
    const holdSeats = async () => {
      try {
        await fetch(`${API_BASE_URL}/seats/hold/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: userId,
            showtime_id: showtimeId,
            seat_ids: seatIds,
            minutes: 5, // hold for 5 minutes
          }),
          signal: controller.signal,
        });
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Error holding seats:", err);
        }
      }
    };

    holdSeats();
    return () => controller.abort();
  }, [selectedSeats, userId, showtimeId]);
  const fetchSeats = async () => {
    try {
      setLoading(true);
      const url = userId
        ? `${API_BASE_URL}/showtimes/${showtimeId}/seats/?user_id=${userId}`
        : `${API_BASE_URL}/showtimes/${showtimeId}/seats/`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setSeats(data.seats);
        setLayout(data.layout);
      } else {
        setError("Failed to load seats");
      }
    } catch (err) {
      console.error("Error fetching seats:", err);
      setError("Failed to load seat map");
    } finally {
      setLoading(false);
    }
  };
  const handleSeatClick = (seat) => {
    if (!seat.is_available) return;
    const isSelected = selectedSeats.find((s) => s.id === seat.id);
    if (isSelected) {
      const newSelection = selectedSeats.filter((s) => s.id !== seat.id);
      setSelectedSeats(newSelection);
      onSeatsSelected(newSelection);
    } else {
      if (selectedSeats.length < maxSeats) {
        const newSelection = [...selectedSeats, seat];
        setSelectedSeats(newSelection);
        onSeatsSelected(newSelection);
      }
    }
  };

  const getSeatClass = (seat) => {
    const isSelected = selectedSeats.find((s) => s.id === seat.id);

    if (!seat.is_available) {
      return "bg-gray-400 cursor-not-allowed opacity-50 pointer-events-none";
    } else if (isSelected) {
      return "bg-blue-600 text-white cursor-pointer hover:bg-blue-700";
    } else {
      return "bg-green-500 text-white cursor-pointer hover:bg-green-600";
    }
  };

  const groupSeatsByRow = () => {
    const grouped = {};
    seats.forEach((seat) => {
      if (!grouped[seat.row_number]) {
        grouped[seat.row_number] = [];
      }
      grouped[seat.row_number].push(seat);
    });
    return grouped;
  };
  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading seat map...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
        {error}
      </div>
    );
  }

  if (!layout) return null;

  const seatsByRow = groupSeatsByRow();

  return (
    <div className="space-y-6">
      {}
      <div className="text-center">
        <div className="inline-block bg-gray-800 text-white px-8 py-2 rounded-t-lg text-sm">
          SCREEN
        </div>
        <div className="h-1 bg-gradient-to-r from-transparent via-gray-400 to-transparent"></div>
      </div>

      {}
      <div className="bg-gray-50 rounded-lg p-6 overflow-x-auto">
        <div className="inline-block min-w-full">
          {Object.keys(seatsByRow)
            .sort((a, b) => a - b)
            .map((rowNum) => {
              const rowSeats = seatsByRow[rowNum];
              const rowLetter = String.fromCharCode(64 + parseInt(rowNum));

              return (
                <div
                  key={rowNum}
                  className="flex items-center justify-center mb-3"
                >
                  {}
                  <div className="w-8 text-center font-semibold text-gray-700 mr-2">
                    {rowLetter}
                  </div>

                  {}
                  <div className="flex gap-2">
                    {rowSeats
                      .sort((a, b) => a.seat_number - b.seat_number)
                      .map((seat) => (
                        <button
                          type="button"
                          key={seat.id}
                          onClick={() => handleSeatClick(seat)}
                          disabled={!seat.is_available}
                          className={`w-10 h-10 rounded-t-lg font-semibold text-xs transition-colors ${getSeatClass(
                            seat
                          )}`}
                          title={
                            seat.is_available
                              ? `Seat ${seat.seat_label}`
                              : `Seat ${seat.seat_label} (Booked)`
                          }
                        >
                          {seat.seat_number}
                        </button>
                      ))}
                  </div>

                  {}
                  <div className="w-8 text-center font-semibold text-gray-700 ml-2">
                    {rowLetter}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
      {}
      <div className="flex justify-center items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-green-500 rounded-t-lg"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-600 rounded-t-lg"></div>
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-400 rounded-t-lg opacity-50"></div>
          <span>Booked</span>
        </div>
      </div>
      {}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <div>
            <span className="font-semibold text-gray-800">Selected Seats:</span>
            <span className="ml-2 text-gray-700">
              {selectedSeats.length > 0
                ? selectedSeats.map((s) => s.seat_label).join(", ")
                : "None"}
            </span>
          </div>
          <div className="text-gray-600">
            {selectedSeats.length} / {maxSeats} tickets
          </div>
        </div>
        {selectedSeats.length < maxSeats && (
          <p className="text-sm text-gray-600 mt-2">
            Please select {maxSeats - selectedSeats.length} more seat
            {maxSeats - selectedSeats.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>
    </div>
  );
}
