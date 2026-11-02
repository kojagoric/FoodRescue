
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { pool } from "@/lib/db";
import ActivityFeed from "./activity-feed";

export default async function Home() {
  const session = await getSession();
  if (!session) redirect("/login");

  const queries = [
    ["Donors", "SELECT COUNT(*) AS n FROM DONOR"],
    ["Recipients", "SELECT COUNT(*) AS n FROM RECIPIENT_ORGANIZATION"],
    ["Food batches", "SELECT COUNT(*) AS n FROM FOOD_BATCH"],
    ["Collection requests", "SELECT COUNT(*) AS n FROM COLLECTION_REQUEST"],
    ["Transport records", "SELECT COUNT(*) AS n FROM TRANSPORTATION"],
    ["Distributions", "SELECT COUNT(*) AS n FROM DISTRIBUTION"]
  ];

  const counts = await Promise.all(
    queries.map(async ([label, sql]) => {
      const [rows] = await pool.query(sql);
      return { label, value: rows[0].n };
    })
  );

  // Food expiry alerts: expired or expiring within 3 days
  const [expiryAlerts] = await pool.query(`
    SELECT Food_Name, Expiry_Date,
    DATEDIFF(Expiry_Date, CURDATE()) AS days_left
    FROM FOOD_BATCH
    WHERE Expiry_Date <= DATE_ADD(CURDATE(), INTERVAL 3 DAY)
    ORDER BY Expiry_Date ASC
  `);

  return (
    <main className="container">
      <h1>FoodRescue dashboard</h1>

      <p className="muted">
        Welcome, {session.email}. Track surplus food from donors
        through final distribution.
      </p>

      <section className="grid">
        {counts.map(item => (
          <article className="card" key={item.label}>
            <div className="muted">{item.label}</div>
            <h1>{item.value}</h1>
          </article>
        ))}
      </section>

      <section className="card" style={{ marginTop: 20 }}>
        <h2>Food Expiry Alerts</h2>
        <p className="muted">
          Expired food and batches expiring within 3 days.
        </p>

        {expiryAlerts.length === 0 ? (
          <p>No expiry alerts currently.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", textAlign: "left" }}>
              <thead>
                <tr>
                  <th>Food</th>
                  <th>Expiry Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {expiryAlerts.map((item, index) => (
                  <tr key={index}>
                    <td>{item.Food_Name}</td>
                    <td>
                      {new Date(item.Expiry_Date).toLocaleDateString("en-IN")}
                    </td>
                    <td style={{
                      color: item.days_left < 0 ? "#dc2626" : "#ea580c",
                      fontWeight: "bold"
                    }}>
                      {item.days_left < 0
                        ? `Expired ${Math.abs(item.days_left)} days ago`
                        : item.days_left === 0
                        ? "Expires today"
                        : `${item.days_left} days left`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="card" style={{ marginTop: 20 }}>
        <h2>Project workflow</h2>
        <p>
          Register donors → record food batches → receive collection
          requests → arrange transportation → record distribution.
        </p>
        <p className="muted">
          Expiry tracking is calculated using MySQL date functions.
        </p>
      </section>

      <ActivityFeed />
    </main>
  );
}
