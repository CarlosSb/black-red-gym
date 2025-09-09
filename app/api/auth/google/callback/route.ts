import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")
    const state = searchParams.get("state") || "login" // login or register

    if (!code) {
      return NextResponse.redirect(new URL("/login?error=auth_failed", request.url))
    }

    // Exchange code for access token
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        code,
        grant_type: "authorization_code",
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`,
      }),
    })

    const tokenData = await tokenResponse.json()

    if (!tokenData.access_token) {
      return NextResponse.redirect(new URL("/login?error=token_failed", request.url))
    }

    // Get user info from Google
    const userResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    })

    const googleUser = await userResponse.json()

    if (!googleUser.email) {
      return NextResponse.redirect(new URL("/login?error=user_info_failed", request.url))
    }

    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { email: googleUser.email }
    })

    if (state === "register") {
      // Registration flow
      if (user) {
        // User already exists, redirect to login
        return NextResponse.redirect(new URL("/login?error=user_exists", request.url))
      }

      // Create new user
      user = await prisma.user.create({
        data: {
          name: googleUser.name,
          email: googleUser.email,
          password: "", // No password for OAuth users
          role: "USER",
          status: "ACTIVE"
        }
      })
    } else {
      // Login flow
      if (!user) {
        // User doesn't exist, redirect to register
        return NextResponse.redirect(new URL("/register?error=user_not_found", request.url))
      }

      if (user.status !== "ACTIVE") {
        return NextResponse.redirect(new URL("/login?error=account_disabled", request.url))
      }
    }

    // Create session cookie
    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
    }

    const response = NextResponse.redirect(
      user.role === "ADMIN"
        ? new URL("/dashboard", request.url)
        : new URL("/student/dashboard", request.url)
    )

    // Set session cookie
    response.cookies.set("blackred_auth", JSON.stringify(userData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response

  } catch (error) {
    console.error("Google OAuth callback error:", error)
    return NextResponse.redirect(new URL("/login?error=server_error", request.url))
  }
}