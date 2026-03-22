import { redirect } from "next/navigation";

export default function BestsellersPage() {
  redirect("/search?sort=popular");
}
