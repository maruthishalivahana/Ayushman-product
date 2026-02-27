import { NextResponse } from "next/server";

const getBackendUrl = () => process.env.BACKEND_API_BASE_URL || "http://localhost:5000";

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "Request must be multipart/form-data with file field 'pdf'" },
        { status: 400 }
      );
    }

    const incoming = await request.formData();
    const file = incoming.get("pdf");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided in field 'pdf'" }, { status: 400 });
    }

    const forwardFormData = new FormData();
    forwardFormData.append("pdf", file, file.name);

    const backendResponse = await fetch(`${getBackendUrl()}/api/claims/process-model`, {
      method: "POST",
      body: forwardFormData,
      cache: "no-store",
    });

    const backendContentType = backendResponse.headers.get("content-type") || "";
    const isJson = backendContentType.includes("application/json");

    if (isJson) {
      const json = await backendResponse.json();
      return NextResponse.json(json, { status: backendResponse.status });
    }

    const text = await backendResponse.text();
    return NextResponse.json(
      { error: text || "Backend returned non-JSON response" },
      { status: backendResponse.status }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to proxy process-model request" },
      { status: 500 }
    );
  }
}
