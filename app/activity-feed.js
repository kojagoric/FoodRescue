
"use client";

import { useEffect, useState } from "react";

export default function ActivityFeed() {
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadActivities() {
    try {
      const response = await fetch("/api/activity");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not load activities");
      }

      setActivities(data);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadActivities();

    const interval = setInterval(loadActivities, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="card" style={{ marginTop: 20 }}>
      <h2>Recent Activity</h2>
      <p className="muted">
        Latest system events from MongoDB. Refreshes every 10 seconds.
      </p>

      {loading && <p>Loading activities...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && activities.length === 0 && (
        <p>No activities recorded yet.</p>
      )}

      {activities.map((activity) => (
        <article
          key={activity._id}
          style={{
            padding: "12px 0",
            borderBottom: "1px solid #e5eaf0"
          }}
        >
          <strong>{activity.event_type}</strong>
          <p>{activity.description}</p>
          <p className="muted">
            By {activity.performed_by} ·{" "}
            {new Date(activity.timestamp).toLocaleString()}
          </p>
        </article>
      ))}
    </section>
  );
}
