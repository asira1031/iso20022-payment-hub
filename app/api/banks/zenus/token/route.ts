import { NextResponse } from "next/server";
import { createAuditLog } from "@/lib/audit";

export const runtime = "nodejs";

export async function GET() {
  try {
    const tokenUrl = process.env.ZENUS_TOKEN_URL;
    const clientId = process.env.ZENUS_CLIENT_ID;
    const clientSecret = process.env.ZENUS_CLIENT_SECRET;
    const grantType = process.env.ZENUS_GRANT_TYPE || "client_credentials";
    const scope = process.env.ZENUS_SCOPE;

    if (!tokenUrl || !clientId || !clientSecret) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Missing Zenus environment variables. Required: ZENUS_TOKEN_URL, ZENUS_CLIENT_ID, ZENUS_CLIENT_SECRET.",
        },
        { status: 500 }
      );
    }

    const body = new URLSearchParams();
    body.set("client_id", clientId);
    body.set("client_secret", clientSecret);
    body.set("grant_type", grantType);
    if (scope) body.set("scope", scope);

    const res = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/x-www-form-urlencoded",
      },
      body,
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok || !data.access_token) {
      return NextResponse.json(
        {
          ok: false,
          status: res.status,
          error: "Failed to obtain Zenus access token.",
          zenus: data,
        },
        { status: 500 }
      );
    }

    await createAuditLog({
      module: "ZENUS",
      action: "ZENUS_TOKEN_CREATED",
      reference_id: "ZENUS_OAUTH",
      details: {
        token_type: data.token_type,
        expires_in: data.expires_in,
      },
    });

    return NextResponse.json({
      ok: true,
      message: "Zenus token created.",
      token_type: data.token_type,
      expires_in: data.expires_in,
      access_token_preview: `${String(data.access_token).slice(0, 12)}...`,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        ok: false,
        error: error.message || "Zenus token request failed.",
      },
      { status: 500 }
    );
  }
}