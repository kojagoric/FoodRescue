
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { requireSession } from "@/lib/auth";

export async function GET() {
  try {
    await requireSession();

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const activities = await db
      .collection("activity_logs")
      .find({})
      .sort({ timestamp: -1 })
      .limit(20)
      .toArray();

    return NextResponse.json(activities);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: error.status || 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await requireSession();
    const body = await request.json();

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const activity = {
      event_type: body.event_type,
      description: body.description,
      performed_by: session.email,
      timestamp: new Date()
    };

    const result = await db
      .collection("activity_logs")
      .insertOne(activity);

    return NextResponse.json({
      ok: true,
      id: result.insertedId
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: error.status || 500 }
    );
  }
}
