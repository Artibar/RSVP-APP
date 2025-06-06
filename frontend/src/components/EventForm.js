
import React, { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function EventForm({ event }) {
  const { token } = useContext(AuthContext);
  const [form, setForm] = useState(
    event || {
      title: "",
      description: "",
      dateTime: "",
      timezone: "",
      location: "",
      rsvpDeadline: "",
      maxAttendees: 100,
    }
  );
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const method = event ? "PUT" : "POST";
    const url = event
      ? `/api/events/${event._id}`
      : "/api/events";
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });
    if (res.ok) navigate("/dashboard");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" value={form.title} onChange={handleChange} placeholder="Title" required />
      <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" required />
      <input name="dateTime" type="datetime-local" value={form.dateTime} onChange={handleChange} required />
      <input name="timezone" value={form.timezone} onChange={handleChange} placeholder="Timezone" required />
      <input name="location" value={form.location} onChange={handleChange} placeholder="Location or URL" required />
      <input name="rsvpDeadline" type="datetime-local" value={form.rsvpDeadline} onChange={handleChange} required />
      <input name="maxAttendees" type="number" value={form.maxAttendees} onChange={handleChange} min={1} required />
      <button type="submit">{event ? "Update" : "Create"} Event</button>
    </form>
  );
}