import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { pool } from "@/lib/db";
import { createSession } from "@/lib/auth";

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) return NextResponse.json({error:"Email and password are required."},{status:400});
    const [rows] = await pool.execute(
      "SELECT user_id, email, password_hash, role FROM USERS WHERE email = ? LIMIT 1", [email]
    );
    if (!rows.length || !(await bcrypt.compare(password, rows[0].password_hash))) {
      return NextResponse.json({error:"Invalid email or password."},{status:401});
    }
    await createSession(rows[0]);
    return NextResponse.json({ok:true, user:{email:rows[0].email, role:rows[0].role}});
  } catch (error) {
    return NextResponse.json({error:error.message || "Login failed."},{status:500});
  }
}
