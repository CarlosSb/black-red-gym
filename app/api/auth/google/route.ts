import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get("action") || "login" // login or register

  const googleAuthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth")

  googleAuthUrl.searchParams.set("client_id", process.env.GOOGLE_CLIENT_ID!)
  googleAuthUrl.searchParams.set("redirect_uri", `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`)
  googleAuthUrl.searchParams.set("response_type", "code")
  googleAuthUrl.searchParams.set("scope", "openid email profile")
  googleAuthUrl.searchParams.set("state", action) // Pass action (login/register) in state

  return NextResponse.redirect(googleAuthUrl.toString())
}