
import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { useRSVP } from "../hooks/useRSVP";
import LiveFeedbackStream from "./LiveFeedbackStream";

export default function EventDetails() {
  const { eventId } = useParams();
  const { token, user } = useContext(AuthContext);
  const [event, setEvent] = useState(null);
  const [rsvpStatus, setRsvpStatus] = useState(null);
  const { rsvp, checkIn } = useRSVP(eventId);

  useEffect(() => {
    fetch(`/api/events/${eventId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(setEvent);
  }, [eventId, token]);

  const handleRSVP = async () => {
    const res = await rsvp();
    setRsvpStatus(res.status);
  };

  const handleCheckIn = async () => {
    const res = await checkIn();
    setRsvpStatus(res.status);
  };

  if (!event) return <div>Loading...</div>;

  const now = new Date();
  const rsvpDeadline = new Date(event.rsvpDeadline);
  const eventDate = new Date(event.dateTime);
  const canRSVP = now < rsvpDeadline;
  const canCheckIn = now >= eventDate && now <= new Date(eventDate.getTime() + 2 * 60 * 60 * 1000); // 2hr window

  return (
    <div>
      <h2>{event.title}</h2>
      <p>{event.description}</p>
      <p>
        {event.dateTime} ({event.timezone})
      </p>
      <p>Location: {event.location}</p>
      <p>Status: {event.status}</p>
      {canRSVP && <button onClick={handleRSVP}>RSVP</button>}
      {canCheckIn && <button onClick={handleCheckIn}>Check In</button>}
      <div>
        <LiveFeedbackStream eventId={eventId} />
      </div>
    </div>
  );
}