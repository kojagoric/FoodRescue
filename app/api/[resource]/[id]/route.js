import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { requireStaff } from "@/lib/auth";
import { resources, pickFields } from "@/lib/resources";

export async function PUT(request, { params }) {
  try {
    await requireStaff();
    const { resource, id } = await params;
    const config = resources[resource];
    if (!config) return NextResponse.json({error:"Unknown resource."},{status:404});
    const data = pickFields(await request.json(), config, true);
    const columns = Object.keys(data);
    const assignments = columns.map(c=>`\`${c}\` = ?`).join(", ");
    const [result] = await pool.execute(
      `UPDATE \`${config.table}\` SET ${assignments} WHERE \`${config.id}\` = ?`,
      [...columns.map(c=>data[c]), id]
    );
    return NextResponse.json({ok:true, affectedRows:result.affectedRows});
  } catch (error) {
    return NextResponse.json({error:error.message},{status:error.status || 400});
  }
}

export async function DELETE(_request, { params }) {
  try {
    await requireStaff();
    const { resource, id } = await params;
    const config = resources[resource];
    if (!config) return NextResponse.json({error:"Unknown resource."},{status:404});
    const [result] = await pool.execute(
      `DELETE FROM \`${config.table}\` WHERE \`${config.id}\` = ?`, [id]
    );
    return NextResponse.json({ok:true, affectedRows:result.affectedRows});
  } catch (error) {
    return NextResponse.json({error:error.message},{status:error.status || 400});
  }
}
