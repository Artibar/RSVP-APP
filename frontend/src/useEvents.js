
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";

export function useEvents() {
  const { token } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchEvents = async () => {
    setLoading(true);
    const res = await fetch("/api/events", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setEvents(data);
    setLoading(false);
  };

  useEffect(() => {
    if (token) fetchEvents();
  }, [token]);

  return { events, fetchEvents, loading };
}