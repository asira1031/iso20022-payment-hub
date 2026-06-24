import { NextResponse } from "next/server";
import { createAuditLog } from "@/lib/audit";

export const runtime = "nodejs";

async function getZenusToken() {
  const body = new URLSearchParams();

  body.set("client_id", process.env.ZENUS_CLIENT_ID!);
  body.set("client_secret", process.env.ZENUS_CLIENT_SECRET!);
  body.set("grant_type", process.env.ZENUS_GRANT_TYPE || "client_credentials");

  if (process.env.ZENUS_SCOPE) {
    body.set("scope", process.env.ZENUS_SCOPE);
  }

  const res = await fetch(process.env.ZENUS_TOKEN_URL!, {
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
    throw new Error("Failed to obtain Zenus access token");
  }

  return data.access_token;
}

export async function GET(req: Request) {
  try {
    const token = await getZenusToken();
    const { searchParams } = new URL(req.url);

    const legalPersonId = searchParams.get("personId") || "ID-30629";
    const masterAccountId = searchParams.get("masterAccountId") || "ID-8630";

    const payload = {
      currencyCode: "USD",
      accountClassCode: "CORPORATE_DDA",
      accountName: "Asira USD Virtual Account",
      masterAccountId,
    };

    const response = await fetch(
      `https://api.dev.zenus.io/api/v4/persons/${legalPersonId}/accounts`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          accept: "application/json",
          "content-type": "application/*+json",
          "x-request-id": crypto.randomUUID(),
        },
        body: JSON.stringify(payload),
        cache: "no-store",
      }
    );

    const data = await response.json();
    const accountId = data?.data?.accountId || null;

    if (response.ok) {
      await createAuditLog({
        module: "ZENUS",
        action: "ZENUS_VIRTUAL_ACCOUNT_CREATED",
        reference_id: accountId || legalPersonId,
        details: {
          legal_person_id: legalPersonId,
          master_account_id: masterAccountId,
          account_id: accountId,
          account_class: "CORPORATE_DDA",
          currency: "USD",
        },
      });
    }

    return NextResponse.json({
      ok: response.ok,
      status: response.status,
      legalPersonId,
      masterAccountId,
      accountId,
      zenus: data,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        ok: false,
        error: error.message || "Failed to create Zenus virtual account.",
      },
      { status: 500 }
    );
  }
}