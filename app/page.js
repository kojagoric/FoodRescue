import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { pool } from "@/lib/db";

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
  const counts = await Promise.all(queries.map(async ([label, sql]) => {
    const [rows] = await pool.query(sql);
    return { label, value: rows[0].n };
  }));

  return <main className="container">
    <h1>FoodRescue dashboard</h1>
    <p className="muted">Welcome, {session.email}. Track surplus food from donors through final distribution.</p>
    <section className="grid">
      {counts.map(item => <article className="card" key={item.label}>
        <div className="muted">{item.label}</div>
        <h1>{item.value}</h1>
      </article>)}
    </section>
    <section className="card" style={{marginTop:20}}>
      <h2>Project workflow</h2>
      <p>Register donors → record food batches → receive collection requests → arrange transportation → record distribution.</p>
      <p className="muted">Expiry tracking is available through the FOOD_BATCH_EXPIRY_VIEW database view.</p>
    </section>
  </main>;
}
