import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { verifyAdminSession } from "@/lib/admin-session"

export async function checkAdminAuth() {
  const cookieStore = await cookies()
  const authCookie = cookieStore.get("admin-auth")
  const session = await verifyAdminSession(authCookie?.value)

  if (!session) {
    redirect("/admin/login")
  }

  return true
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies()
  const authCookie = cookieStore.get("admin-auth")
  const session = await verifyAdminSession(authCookie?.value)

  return !!session
}
