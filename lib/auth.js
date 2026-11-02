import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE_NAME = "foodrescue_session";

function secretKey() {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 32) {
    throw new Error("AUTH_SECRET must be set to at least 32 characters.");
  }
  return new TextEncoder().encode(value);
}

export async function createSession(user) {
  const token = await new SignJWT({
    userId: user.user_id,
    email: user.email,
    role: user.role
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(secretKey());

  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8
  });
}

export async function getSession() {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey());
    return payload;
  } catch {
    return null;
  }
}

export async function destroySession() {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}

export async function requireSession() {
  const session = await getSession();
  if (!session) {
    const error = new Error("Authentication required");
    error.status = 401;
    throw error;
  }
  return session;
}

export async function requireStaff() {
  const session = await requireSession();
  if (!["admin", "staff"].includes(session.role)) {
    const error = new Error("Insufficient permissions");
    error.status = 403;
    throw error;
  }
  return session;
}
