import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";


export async function middleware(request: NextRequest) {



  return NextResponse.next();
}

// Matcher for protected routes
export const config = {
  matcher: "/((?!api|_next|.*\\..*).*)",
};
