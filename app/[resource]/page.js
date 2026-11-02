import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { pool } from "@/lib/db";
import { resources } from "@/lib/resources";
import ResourceClient from "./resource-client";

export default async function ResourcePage({ params }) {
  const session = await getSession();
  if (!session) redirect("/login");
  const { resource } = await params;
  const config = resources[resource];
  if (!config) notFound();
  const [rows] = await pool.query(`SELECT * FROM \`${config.table}\` ORDER BY \`${config.id}\` DESC LIMIT 200`);
  const data = JSON.parse(JSON.stringify(rows));
  return <main className="container">
    <h1>{resource.replaceAll("_"," ").replace(/\b\w/g,c=>c.toUpperCase())}</h1>
    <p className="muted">Showing up to 200 records. Add records using the JSON form below.</p>
    <ResourceClient resource={resource} rows={data} fields={config.fields} />
  </main>;
}
