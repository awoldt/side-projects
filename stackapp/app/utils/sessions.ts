import { createCookieSessionStorage } from "@remix-run/node";

type SessionData = {
  a_id: string;
};

type SessionFlashData = {
  error: string;
};

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData, SessionFlashData>({
    cookie: {
      name: "a_id",
      httpOnly: true,
      maxAge: 7776000, // 3 months
      sameSite: "strict",
      secure: true,
      secrets: [process.env.COOKIE_SECRET!],
    },
  });

export { getSession, commitSession, destroySession };
