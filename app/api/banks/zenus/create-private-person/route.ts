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

export async function GET() {
  try {
    const token = await getZenusToken();
    const idNumber = `OWNER-${Date.now()}`;
    const taxNumber = `${Date.now()}`;

    const payload = {
      personTypeCode: "P",
      givenName: "Janica",
      surname: "Maldives",
      birthDate: "1995-01-01",

      identificationNumbers: [
        {
          idCountryCode: "PH",
          idNumber,
          primary: true,
        },
      ],

      addresses: [
        {
          addressTypeCode: "R",
          street1: "Makati City",
          cityCounty: "Makati",
          stateRegion: "NCR",
          zip: "1226",
          countryCode: "PH",
        },
      ],

      taxNumbers: [
        {
          taxNumber,
          taxNumberTypeCode: "TAX_CODE",
          taxCountryCode: "PH",
          primary: true,
        },
      ],

      residencyCountryCode: "PH",
      nationality: "PH",
      email: "asira1031@gmail.com",
      phoneCountryCode: "+63",
      phoneNumber: "9000000000",
      sex: "F",
      countryOfBirth: "PH",
      placeOfBirth: "Philippines",
      pep: false,
      usResident: false,
    };

    const response = await fetch("https://api.dev.zenus.io/api/v2/persons", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        accept: "application/json",
        "content-type": "application/json",
        "x-request-id": crypto.randomUUID(),
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const data = await response.json();
    const privatePersonId = data?.data?.personId || null;

    if (response.ok) {
      await createAuditLog({
        module: "ZENUS",
        action: "ZENUS_PRIVATE_PERSON_CREATED",
        reference_id: privatePersonId || idNumber,
        details: {
          private_person_id: privatePersonId,
          id_number: idNumber,
          tax_number: taxNumber,
        },
      });
    }

    return NextResponse.json({
      ok: response.ok,
      status: response.status,
      privatePersonId,
      idNumber,
      taxNumber,
      zenus: data,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        ok: false,
        error: error.message || "Failed to create Zenus private person.",
      },
      { status: 500 }
    );
  }
}