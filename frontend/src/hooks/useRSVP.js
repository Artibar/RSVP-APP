
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export function useRSVP(eventId) {
  const { token } = useContext(AuthContext);

  const rsvp = async () => {
    const res = await fetch(`/api/events/${eventId}/rsvp`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    return await res.json();
  };

  const checkIn = async () => {
    const res = await fetch(`/api/events/${eventId}/checkin`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    return await res.json();
  };

  return { rsvp, checkIn };
}