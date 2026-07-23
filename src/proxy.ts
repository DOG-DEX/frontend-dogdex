import createMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const handleI18nRouting = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);

  const modifiedRequest = new NextRequest(request, {
    headers: requestHeaders,
  });

  const response = handleI18nRouting(modifiedRequest);
  response.headers.set("x-pathname", pathname);

  return response;
}

export const config = {
  matcher: ["/", "/(vi|en)/:path*"],
};
