import createMiddleware from "next-intl/middleware";
import { locales } from "./i18n.config";
import { NextRequest } from 'next/server';
import { withAuth } from "next-auth/middleware";

// Creating middleware for internationalization
const intlMiddleware = createMiddleware({
  locales: locales,
  defaultLocale: "en",
});

// Creating middleware for authentication that includes internationalization
const authMiddleware = withAuth(
  function onSuccess(req) {
    return intlMiddleware(req);
  },
  {
    callbacks: {
      authorized: ({ token }) => token != null, // Callback to check if token is not null
    },
    pages: {
      signIn: "/auth/login", // Page for signing in
    },
  }
);

// Exporting the middleware function
export default function middleware(req: NextRequest) {
  // Creating a pattern to exclude certain paths from authentication
  const excludePattern = "^(/(" + locales.join("|") + "))?/admin/?.*?$";
  // Creating a regex for the exclude pattern to match against the request pathname
  const publicPathnameRegex = RegExp(excludePattern, "i");
  // Checking if the request pathname matches the publicPathnameRegex
  const isPublicPage = !publicPathnameRegex.test(req.nextUrl.pathname);

  // If the page is public, use the intlMiddleware, otherwise use the authMiddleware
  if (isPublicPage) {
    return intlMiddleware(req);
  } else {
    return (authMiddleware as any)(req);
  }
}

// Exporting the configuration for the middleware
export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"], // Pattern to match against the request pathname
};