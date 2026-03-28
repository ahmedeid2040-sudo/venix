import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { seedUsers, type SeedUser, type UserRole } from "@/data/users";

const SESSION_COOKIE = "venix_session";
const TOKEN_SECRET = process.env.AUTH_SECRET || "venix-center-auth-secret";
const PASSWORD_SALT = "venix-password-salt";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 12;
const REMEMBER_DURATION_MS = 1000 * 60 * 60 * 24 * 14;

export function hashPassword(username: string, password: string) {
  return createHash("sha256")
    .update(`${PASSWORD_SALT}::${username}::${password}`)
    .digest("hex");
}

export function findUser(username: string) {
  return seedUsers.find((user) => user.username === username.trim());
}

export function verifyPassword(user: SeedUser, password: string) {
  const actual = Buffer.from(user.passwordHash, "hex");
  const expected = Buffer.from(hashPassword(user.username, password), "hex");
  if (actual.length !== expected.length) return false;
  return timingSafeEqual(actual, expected);
}

interface SessionPayload {
  sub: string;
  username: string;
  displayName: string;
  role: UserRole;
  exp: number;
}

function signPayload(payload: SessionPayload) {
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = createHmac("sha256", TOKEN_SECRET).update(encoded).digest("base64url");
  return `${encoded}.${signature}`;
}

function unsignPayload(token: string): SessionPayload | null {
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;
  const expected = createHmac("sha256", TOKEN_SECRET).update(encoded).digest("base64url");
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as SessionPayload;
    if (Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

export function createSessionToken(user: SeedUser, remember = true) {
  return signPayload({
    sub: user.id,
    username: user.username,
    displayName: user.displayName,
    role: user.role,
    exp: Date.now() + (remember ? REMEMBER_DURATION_MS : SESSION_DURATION_MS)
  });
}

export function readSessionFromRequest(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return unsignPayload(token);
}

export async function readSessionFromCookies() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return unsignPayload(token);
}

export function getAuthCookieOptions(remember = true) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: remember ? REMEMBER_DURATION_MS / 1000 : SESSION_DURATION_MS / 1000
  };
}

export const authCookie = {
  name: SESSION_COOKIE,
  options: getAuthCookieOptions(true)
};
