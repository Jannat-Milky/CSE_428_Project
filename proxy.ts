import { type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  // Just pass through - no auth checks
  return;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};