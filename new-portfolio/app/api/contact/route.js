import { NextResponse } from "next/server";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_BODY_BYTES = 12_000;

export async function POST(request) {
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "That message is too large." }, { status: 413 });
  }

  const origin = request.headers.get("origin");
  const requestHost = request.headers.get("x-forwarded-host") || request.headers.get("host");
  if (origin && requestHost) {
    try {
      if (new URL(origin).host !== requestHost) {
        return NextResponse.json({ error: "This request could not be verified." }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ error: "This request could not be verified." }, { status: 403 });
    }
  }

  let data;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ error: "Please check the form and try again." }, { status: 400 });
  }

  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return NextResponse.json({ error: "Please check the form and try again." }, { status: 400 });
  }

  const { name, email, message, website_url: websiteUrl, loaded_at: loadedAt } = data;
  if (typeof websiteUrl === "string" && websiteUrl.trim()) {
    return NextResponse.json({ ok: true });
  }
  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof message !== "string" ||
    name.trim().length < 2 ||
    name.trim().length > 80 ||
    !EMAIL_PATTERN.test(email) ||
    email.length > 254 ||
    message.trim().length < 10 ||
    message.length > 5000
  ) {
    return NextResponse.json({ error: "Please enter a valid name, email, and message." }, { status: 400 });
  }

  const submittedAt = Number(loadedAt);
  const elapsed = Date.now() - submittedAt;
  if (!Number.isFinite(submittedAt) || elapsed < 2500 || elapsed > 2 * 60 * 60 * 1000) {
    return NextResponse.json({ error: "Please take a moment to review the form and try again." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "The message service is not configured yet. Please email Abdullah directly." },
      { status: 503 }
    );
  }

  let response;
  try {
    response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM || "Abdullah's Portfolio <onboarding@resend.dev>",
        to: [process.env.CONTACT_TO || "abdullahasgerali@gmail.com"],
        reply_to: email,
        subject: `Portfolio message from ${name.trim()}`,
        text: `Name: ${name.trim()}\nEmail: ${email.trim()}\n\n${message.trim()}`,
      }),
    });
  } catch (error) {
    console.error("Contact email provider request failed.", error);
    return NextResponse.json(
      { error: "The message could not be delivered right now. Please try again later." },
      { status: 502 }
    );
  }

  if (!response.ok) {
    const details = await response.json().catch(() => ({}));
    console.error("Contact email provider rejected a message.", response.status, details.message);
    return NextResponse.json(
      { error: "The message could not be delivered right now. Please try again later." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
