import { NextResponse } from "next/server";
import { readSessionFromCookies } from "@/lib/auth";
import { userRoleLabels } from "@/lib/brand";

export async function GET() {
  const session = await readSessionFromCookies();

  if (!session) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  return NextResponse.json({
    user: {
      id: session.sub,
      username: session.username,
      displayName: session.displayName,
      role: session.role,
      roleLabel: userRoleLabels[session.role]
    }
  });
}
