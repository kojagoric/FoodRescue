import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { requireStaff } from "@/lib/auth";
import { resources, pickFields } from "@/lib/resources";

export async function PUT(request, { params }) {
  try {
    await requireStaff();

    const { resource, id } = await params;
    const config = resources[resource];

    if (!config) {
      return NextResponse.json(
        { error: "Unknown resource." },
        { status: 404 }
      );
    }

    const data = pickFields(await request.json(), config, true);
    const columns = Object.keys(data);

    if (columns.length === 0) {
      return NextResponse.json(
        { error: "No valid fields provided." },
        { status: 400 }
      );
    }

    const assignments = columns
      .map((column) => `\`${column}\` = ?`)
      .join(", ");

    const [result] = await pool.execute(
      `UPDATE \`${config.table}\` SET ${assignments} WHERE \`${config.id}\` = ?`,
      [...columns.map((column) => data[column]), id]
    );

    if (result.affectedRows === 0) {
      const [rows] = await pool.execute(
        `SELECT \`${config.id}\` FROM \`${config.table}\` WHERE \`${config.id}\` = ?`,
        [id]
      );

      if (rows.length === 0) {
        return NextResponse.json(
          { error: "Record not found." },
          { status: 404 }
        );
      }
    }

    return NextResponse.json({
      ok: true,
      affectedRows: result.affectedRows
    });
  } catch (error) {
    console.error("UPDATE error:", error);

    return NextResponse.json(
      { error: error.message || "Unable to update record." },
      { status: error.status || 500 }
    );
  }
}

export async function DELETE(_request, { params }) {
  try {
    await requireStaff();

    const { resource, id } = await params;
    const config = resources[resource];

    if (!config) {
      return NextResponse.json(
        { error: "Unknown resource." },
        { status: 404 }
      );
    }

    const [result] = await pool.execute(
      `DELETE FROM \`${config.table}\` WHERE \`${config.id}\` = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: "Record not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Record deleted successfully."
    });

  } catch (error) {
    console.error("DELETE error:", error);

    if (
      error.code === "ER_ROW_IS_REFERENCED_2" ||
      error.errno === 1451
    ) {
      return NextResponse.json(
        {
          error: "Cannot delete this record because dependent records exist."
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        error: error.message || "Unable to delete this record."
      },
      { status: error.status || 500 }
    );
  }
}