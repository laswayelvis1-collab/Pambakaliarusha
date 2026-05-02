import { redirect } from "next/navigation";
import { getAuthedUser, requireAuth, requireAdmin } from "./getAuthedUser";

export { getAuthedUser, requireAuth, requireAdmin };

export async function requireLogin() {
  const user = await getAuthedUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}

export async function requireAdminRole() {
  const user = await requireAuth();
  if (user.role !== "ADMIN") {
    return null; // Will trigger 403
  }
  return user;
}