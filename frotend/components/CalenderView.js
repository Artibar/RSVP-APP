
import React from "react";
import { useEvents } from "../hooks/useEvents";
import EventCard from "./EventCard";

export default function CalendarView() {
  const { events, loading } = useEvents();

  if (loading) return <div>Loading...</div>;

  // Simple list, can be replaced with a calendar UI
  return (
    <div>
      <h2>Upcoming Events</h2>
      <ul>
        {events.map(event => (
          <li key={event._id}>
            <EventCard event={event} />
          </li>
        ))}
      </ul>
    </div>
  );
}