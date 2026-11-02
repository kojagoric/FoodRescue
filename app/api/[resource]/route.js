import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { requireSession, requireStaff } from "@/lib/auth";
import { resources, pickFields } from "@/lib/resources";

export async function GET(_request, { params }) {
  try {
    await requireSession();
    const { resource } = await params;
    const config = resources[resource];
    if (!config) return NextResponse.json({error:"Unknown resource."},{status:404});
    const [rows] = await pool.query(`SELECT * FROM \`${config.table}\` ORDER BY \`${config.id}\` DESC LIMIT 500`);
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({error:error.message},{status:error.status || 500});
  }
}

export async function POST(request, { params }) {
  try {
    await requireStaff();
    const { resource } = await params;
    const config = resources[resource];
    if (!config) return NextResponse.json({error:"Unknown resource."},{status:404});
    const body = await request.json();
    const data = pickFields(body, config);
    const columns = Object.keys(data);
    const placeholders = columns.map(()=>"?").join(", ");
    const sql = `INSERT INTO \`${config.table}\` (${columns.map(c=>`\`${c}\``).join(", ")}) VALUES (${placeholders})`;
    const [result] = await pool.execute(sql, columns.map(c=>data[c]));
    return NextResponse.json({ok:true, id:result.insertId}, {status:201});
  } catch (error) {
    return NextResponse.json({error:error.message},{status:error.status || 400});
  }
}
