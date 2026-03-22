import { redirect } from "next/navigation";

export default function NewPage() {
  redirect("/search?sort=newest");
}
