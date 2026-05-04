import { redirect } from "next/navigation";
import { getAuthedUser } from "@/lib/auth/getAuthedUser";

export default function AddressesPage() {
  redirect("/account");
}