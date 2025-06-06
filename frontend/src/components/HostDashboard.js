import React, { useContext } from "react";
import { useEvents } from "../hooks/useEvents";
import { AuthContext } from "../contexts/AuthContext";
import EventCard from "./EventCard";
import { Link } from "react-router-dom";

export default function HostDashboard() {
  const { user } = useContext(AuthContext);
  const { events, loading, error } = useEvents();

  if (!user) return <div>Please log in.</div>;
  if (loading) return <div>Loading your events...</div>;
  if (error) return <div>Error loading events: {error}</div>;

  // Filter events where user is the host
  const myEvents = events.filter(e => 
    e.hostId === user.id || 
    e.hostId._id === user.id ||
    (typeof e.hostId === 'object' && e.hostId._id === user.id)
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2>My Events ({myEvents.length})</h2>
        <Link 
          to="/event/new"
          style={{
            padding: "8px 16px",
            backgroundColor: "#007bff",
            color: "white",
            textDecoration: "none",
            borderRadius: "4px"
          }}
        >
          Create New Event
        </Link>
      </div>
      
      {myEvents.length === 0 ? (
        <p>You haven't created any events yet. <Link to="/event/new">Create your first event!</Link></p>
      ) : (
        <div style={{ display: "grid", gap: "16px" }}>
          {myEvents.map(event => (
            <div key={event._id} style={{ position: "relative" }}>
              <EventCard event={event} />
              <div style={{ marginTop: "8px" }}>
                <Link 
                  to={`/event/${event._id}/analytics`}
                  style={{ 
                    marginRight: "8px", 
                    padding: "4px 8px",
                    backgroundColor: "#28a745",
                    color: "white",
                    textDecoration: "none",
                    borderRadius: "4px",
                    fontSize: "12px"
                  }}
                >
                  View Analytics
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
