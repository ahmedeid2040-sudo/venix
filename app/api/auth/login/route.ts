import { NextResponse } from "next/server";
import { createSessionToken, findUser, getAuthCookieOptions, verifyPassword } from "@/lib/auth";
import { userRoleLabels } from "@/lib/brand";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const username = String(body?.username || "").trim();
  const password = String(body?.password || "");
  const remember = Boolean(body?.remember ?? true);

  if (!username || !password) {
    return NextResponse.json({ message: "يرجى إدخال اسم المستخدم وكلمة المرور." }, { status: 400 });
  }

  const user = findUser(username);
  if (!user || !verifyPassword(user, password)) {
    return NextResponse.json({ message: "بيانات الدخول غير صحيحة. راجع اسم المستخدم أو كلمة المرور." }, { status: 401 });
  }

  const response = NextResponse.json({
    ok: true,
    user: {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      role: user.role,
      roleLabel: userRoleLabels[user.role]
    }
  });

  response.cookies.set("venix_session", createSessionToken(user, remember), getAuthCookieOptions(remember));
  return response;
}
