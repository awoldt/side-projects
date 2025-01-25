import { createCookieSessionStorage } from "@remix-run/node";

type SessionData = {
  userId: string;
};

type SessionFlashData = {
  error: string;
};

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData, SessionFlashData>({
    // a Cookie from `createCookie` or the CookieOptions to create one
    cookie: {
      name: "__session",
      secrets: [process.env.SESSION_SECRET!],
      secure: process.env.NODE_ENV === "development" ? false : true,
      maxAge: 2629746, // 1 month
    },
  });

export { getSession, commitSession, destroySession };
