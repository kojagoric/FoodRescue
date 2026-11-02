
import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { requireSession, requireStaff } from "@/lib/auth";
import { resources, pickFields } from "@/lib/resources";

// GET: Fetch a single record
export async function GET(_request, { params }) {
  try {
    await requireSession();

    const { resource, id } = await params;
    const config = resources[resource];

    if (!config) {
      return NextResponse.json(
        { error: "Unknown resource." },
        { status: 404 }
      );
    }

    const [rows] = await pool.execute(
      `SELECT * FROM \`${config.table}\` WHERE \`${config.id}\` = ?`,
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Record not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("GET RECORD ERROR:", error);

    return NextResponse.json(
      { error: error.message || "Failed to fetch record." },
      { status: error.status || 500 }
    );
  }
}

// PUT: Update a record
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

    const body = await request.json();
    const data = pickFields(body, config);
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

    const values = columns.map((column) => data[column]);

    const [result] = await pool.execute(
      `UPDATE \`${config.table}\` SET ${assignments} WHERE \`${config.id}\` = ?`,
      [...values, id]
    );

    if (result.affectedRows === 0) {
      const [existing] = await pool.execute(
        `SELECT 1 FROM \`${config.table}\` WHERE \`${config.id}\` = ?`,
        [id]
      );

      if (existing.length === 0) {
        return NextResponse.json(
          { error: "Record not found." },
          { status: 404 }
        );
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("UPDATE RECORD ERROR:", error);

    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      return NextResponse.json(
        {
          error:
            "Cannot update this record because other records depend on it.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to update record." },
      { status: error.status || 500 }
    );
  }
}

// DELETE: Delete a record after checking dependencies
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

    // Find foreign keys referencing this table
    const [foreignKeys] = await pool.execute(
      `SELECT TABLE_NAME, COLUMN_NAME
       FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
       WHERE REFERENCED_TABLE_SCHEMA = DATABASE()
         AND REFERENCED_TABLE_NAME = ?
         AND REFERENCED_COLUMN_NAME = ?`,
      [config.table, config.id]
    );

    // Check dependent records
    const dependencies = [];

    for (const fk of foreignKeys) {
      const [rows] = await pool.execute(
        `SELECT COUNT(*) AS count
         FROM \`${fk.TABLE_NAME}\`
         WHERE \`${fk.COLUMN_NAME}\` = ?`,
        [id]
      );

      const count = Number(rows[0].count);

      if (count > 0) {
        dependencies.push(
          `${fk.TABLE_NAME}: ${count} record(s)`
        );
      }
    }

    // Block deletion if dependencies exist
    if (dependencies.length > 0) {
      return NextResponse.json(
        {
          error:
            `Cannot delete this record. Dependent records exist in ${dependencies.join(", ")}. Delete those records first.`,
        },
        { status: 409 }
      );
    }

    // Delete record
    const [result] = await pool.execute(
      `DELETE FROM \`${config.table}\`
       WHERE \`${config.id}\` = ?`,
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
      message: "Record deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE RECORD ERROR:", error);

    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      return NextResponse.json(
        {
          error:
            "Cannot delete this record because dependent records exist. Delete them first.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to delete record." },
      { status: error.status || 500 }
    );
  }
}
