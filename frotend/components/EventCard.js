
import React from "react";
import { Link } from "react-router-dom";

export default function EventCard({ event }) {
  return (
    <div style={{ border: "1px solid #ccc", margin: 8, padding: 8 }}>
      <h3>
        <Link to={`/event/${event._id}`}>{event.title}</Link>
      </h3>
      <p>{event.description}</p>
      <p>
        {event.dateTime} ({event.timezone})
      </p>
      <p>Status: {event.status}</p>
    </div>
  );
}