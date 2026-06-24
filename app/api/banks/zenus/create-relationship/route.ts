import { NextResponse } from "next/server";
import { createAuditLog } from "@/lib/audit";

export const runtime = "nodejs";

async function getZenusToken() {
  const body = new URLSearchParams();

  body.set("client_id", process.env.ZENUS_CLIENT_ID!);
  body.set("client_secret", process.env.ZENUS_CLIENT_SECRET!);
  body.set(
    "grant_type",
    process.env.ZENUS_GRANT_TYPE || "client_credentials"
  );

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

    const legalPersonId =
      searchParams.get("personId") || "ID-30629";

    const ownerIdNumber =
      searchParams.get("idNumber");

    if (!ownerIdNumber) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Missing idNumber. Example: ?personId=ID-30629&idNumber=OWNER-XXXX",
        },
        { status: 400 }
      );
    }

    const payload = {
      relationships: [
        {
          idCountryCode: "PH",
          idNumber: ownerIdNumber,

          relationTypeCode: "MEMBER_OF_BOARD",

          statusCode: "ACTIVE",

          role: "OWNER_SIGNATORY",

         
          beneficiary: true,

          representingRange: {
            startDate: "2026-01-01T00:00:00.000Z",
          },

          source: {
            sourceName: "TDI_ISO20022_HUB",
            sourceRef: `REL-${Date.now()}`,
          },
        },
      ],
    };

    const response = await fetch(
      `https://api.dev.zenus.io/api/v1/persons/${legalPersonId}/relations`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          accept: "application/json",
          "content-type": "application/json",
          "x-request-id": crypto.randomUUID(),
        },
        body: JSON.stringify(payload),
        cache: "no-store",
      }
    );

    const data = await response.json();

    if (response.ok) {
      await createAuditLog({
        module: "ZENUS",
        action: "ZENUS_RELATIONSHIP_CREATED",
        reference_id: legalPersonId,
        details: {
          legal_person_id: legalPersonId,
          owner_id_number: ownerIdNumber,
          relation_type: "MEMBER_OF_BOARD",
          role: "OWNER_SIGNATORY",
        },
      });
    }

    return NextResponse.json({
      ok: response.ok,
      status: response.status,
      legalPersonId,
      ownerIdNumber,
      zenus: data,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error.message ||
          "Failed to create Zenus relationship.",
      },
      { status: 500 }
    );
  }
}