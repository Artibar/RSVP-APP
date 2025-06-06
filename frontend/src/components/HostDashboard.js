
import React, { useContext } from "react";
import { useEvents } from "../hooks/useEvents";
import { AuthContext } from "../contexts/AuthContext";
import EventCard from "./EventCard";
import { Link } from "react-router-dom";

export default function HostDashboard() {
  const { user } = useContext(AuthContext);
  const { events, loading } = useEvents();

  if (!user) return <div>Please log in.</div>;
  if (loading) return <div>Loading...</div>;

  const myEvents = events.filter(e => e.hostId === user.id);

  return (
    <div>
      <h2>My Events</h2>
      <Link to="/event/new">Create New Event</Link>
      <ul>
        {myEvents.map(event => (
          <li key={event._id}>
            <EventCard event={event} />
          </li>
        ))}
      </ul>
    </div>
  );
}