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

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const personId = body.personId;
    const masterAccountId = body.masterAccountId;
    const currencyCode = body.currencyCode || "USD";
    const accountClassCode = body.accountClassCode || "CORPORATE_DDA";
    const accountName = body.accountName || "TDI USD Virtual Account";

    if (!personId || !masterAccountId) {
      return NextResponse.json(
        {
          ok: false,
          error: "personId and masterAccountId are required.",
        },
        { status: 400 }
      );
    }

    const token = await getZenusToken();

    const payload = {
      currencyCode,
      accountClassCode,
      accountName,
      masterAccountId,
    };

    const response = await fetch(
      `https://api.dev.zenus.io/api/v4/persons/${personId}/accounts`,
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
        reference_id: accountId || personId,
        details: {
          person_id: personId,
          master_account_id: masterAccountId,
          account_id: accountId,
          account_class: accountClassCode,
          currency: currencyCode,
          account_name: accountName,
        },
      });
    }

    return NextResponse.json({
      ok: response.ok,
      status: response.status,
      personId,
      masterAccountId,
      accountId,
      payload,
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