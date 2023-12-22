import { useCookies } from "react-cookie";

export default function LogOut() {
  const [cookies, setCookie, removeCookie] = useCookies(["account_id"]);

  return (
    <button
      onClick={() => {
        removeCookie("account_id");
        window.location.assign("/");
      }}
    >
      Logout
    </button>
  );
}
