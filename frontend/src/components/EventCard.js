
import React from "react";
import { Link } from "react-router-dom";

export default function EventCard({ event }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div style={{ 
      border: "1px solid #ccc", 
      borderRadius: "8px",
      margin: "8px", 
      padding: "16px",
      backgroundColor: "#f9f9f9"
    }}>
      <h3 style={{ margin: "0 0 8px 0" }}>
        <Link 
          to={`/event/${event._id}`}
          style={{ textDecoration: "none", color: "#007bff" }}
        >
          {event.title}
        </Link>
      </h3>
      <p style={{ margin: "4px 0" }}>{event.description}</p>
      <p style={{ margin: "4px 0", fontSize: "14px", color: "#666" }}>
        📅 {formatDate(event.dateTime)}
        {event.timezone && ` (${event.timezone})`}
      </p>
      <p style={{ margin: "4px 0", fontSize: "14px", color: "#666" }}>
        📍 {event.location}
      </p>
      <p style={{ margin: "4px 0" }}>
        <span style={{ 
          padding: "2px 8px", 
          borderRadius: "4px", 
          backgroundColor: event.status === "Live" ? "#28a745" : "#6c757d",
          color: "white",
          fontSize: "12px"
        }}>
          {event.status}
        </span>
      </p>
    </div>
  );
}
