import { Button } from "react-bootstrap";

export default function SignOutBtn() {
  return (
    <Button
      variant="danger"
      onClick={() => {
        document.cookie =
          "__session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        location.reload();
      }}
    >
      Sign out
    </Button>
  );
}
