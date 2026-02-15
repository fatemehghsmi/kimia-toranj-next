// app/user-panel/page.jsx
import { redirect } from "next/navigation";

export default function UserPanelIndex() {
  redirect("/user-panel/wishlist");
}
