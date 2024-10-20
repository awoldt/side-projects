import { UserData } from "./routes/_index";

export async function TakeScreenshot(
  siteUrl: string,
  screenshotApiEndpoint: string,
  apiKey: string,
  setGeneratedImage: React.Dispatch<React.SetStateAction<undefined | string>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setUser: React.Dispatch<React.SetStateAction<UserData | null>>
) {
  setLoading(true);
  try {
    const req = await fetch(
      `${screenshotApiEndpoint}/?site=${encodeURIComponent(
        siteUrl
      )}&api_key=${apiKey}`,
      {
        method: "POST",
      }
    );
    const res = await req.json();

    if (res.success) {
      setGeneratedImage(res.data.url);
      setUser((prev) => {
        if (prev !== null) {
          return {
            ...prev,
            screenshots_remaining: prev.screenshots_remaining - 1,
          };
        }
        return null;
      });
    }
  } catch (error) {
    console.log(error);
    return null;
  }

  setLoading(false);
}
