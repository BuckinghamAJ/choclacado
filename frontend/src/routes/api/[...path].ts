import { auth } from "~/lib/auth";
import { APIEvent } from "@solidjs/start/server";
import { getRequestEvent } from "solid-js/web";
import { getCookie } from "vinxi/http";

const GO_API_URL = process.env.API_URL || "http://api:7373";

async function handler(event: APIEvent) {
  const path = event.params.path || "";

  const url = new URL(`/api/${path}`, GO_API_URL);
  new URL(event.request.url).searchParams.forEach((value, key) => {
    url.searchParams.append(key, value);
  });

  const rheaders = new Headers(event.request.headers);
  rheaders.delete("host");

  try {
    const { token } = await auth.api.getToken({
      headers: rheaders,
    });

    rheaders.set("Authorization", `Bearer ${token}`);

    const response = await fetch(url.toString(), {
      method: event.request.method,
      headers: rheaders,
      body: event.request.body,
      duplex: "half",
    } as RequestInit);

    const responseHeaders = new Headers(response.headers);
    responseHeaders.delete("content-encoding");
    responseHeaders.delete("content-length");
    responseHeaders.delete("transfer-encoding");

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return new Response(JSON.stringify({ error: "Failed to proxy request" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
export const PATCH = handler;
export const HEAD = handler;
export const OPTIONS = handler;
