

import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export default function AnalyticsPage() {
  const { eventId } = useParams();
  const { token } = useContext(AuthContext);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetch(`/api/events/${eventId}/analytics`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(setAnalytics);
  }, [eventId, token]);

  if (!analytics) return <div>Loading analytics...</div>;

  return (
    <div>
      <h2>Event Analytics</h2>
      <p>Total RSVPs: {analytics.totalRSVPs}</p>
      <p>Actual Check-ins: {analytics.actualCheckIns}</p>
      <p>Feedback Volume: {analytics.feedbackVolume}</p>
      <p>Top Emoji Reactions: {analytics.topEmojis.join(", ")}</p>
      <div>
        <h4>Common Feedback Keywords:</h4>
        <div>
          {analytics.keywords.map((kw, i) => (
            <span key={i} style={{ margin: 4, padding: 4, border: "1px solid #ccc" }}>
              {kw}
            </span>
          ))}
        </div>
      </div>
      {/* You can add a chart here using Chart.js or Recharts */}
    </div>
  );
}