'use client'

import { Button } from "./ui/button"
import { logout } from "@/app/actions/auth"

export default function LogoutButton() {
  return (
    <form action={logout}>
      <Button variant="outline" size="sm" type="submit">Logout</Button>
    </form>
  )
}
