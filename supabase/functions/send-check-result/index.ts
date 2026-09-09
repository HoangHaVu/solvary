// Edge Function — send-check-result
// Verschickt die Lösungs-Check-Auswertung (/check) per E-Mail an den Lead.
// Deploy: supabase functions deploy send-check-result
// Required secret: RESEND_API_KEY

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface CheckResultPayload {
  to: string;
  name?: string;
  hero: { name: string; tagline: string };
  reasons: string[];
  alsoRelevant: { name: string; tagline: string }[];
  timeSavedHint?: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
  if (!RESEND_API_KEY) {
    return new Response(JSON.stringify({ sent: false, reason: "no_api_key" }), {
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  }

  let payload: CheckResultPayload;
  try {
    payload = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Ungültiger JSON-Body" }), {
      status: 400,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  }

  const { to, name, hero, reasons, alsoRelevant, timeSavedHint } = payload;
  if (!to || !hero?.name) {
    return new Response(
      JSON.stringify({
        error: "Fehlende Felder: to, hero.name sind erforderlich.",
      }),
      {
        status: 400,
        headers: { ...CORS, "Content-Type": "application/json" },
      },
    );
  }

  const greeting = name ? `Hi ${name}` : "Hi";

  const reasonsHtml = reasons.length
    ? `<ul style="margin: 0; padding-left: 20px; color: #303030;">
        ${reasons.map((r) => `<li style="padding: 4px 0;">${r}</li>`).join("")}
      </ul>`
    : "";

  const alsoRelevantHtml = alsoRelevant.length
    ? `<div style="margin-top: 20px; padding: 16px; background: #f8fafc; border-radius: 8px;">
        <p style="margin: 0 0 8px; font-size: 13px; color: #64748b;">Das hängt bei dir zusammen:</p>
        ${alsoRelevant.map((m) => `<p style="margin: 4px 0; font-weight: bold; color: #303030;">${m.name} — <span style="font-weight: normal; color: #64748b;">${m.tagline}</span></p>`).join("")}
      </div>`
    : "";

  const timeSavedHtml = timeSavedHint
    ? `<div style="margin-top: 16px; padding: 12px; background: #FAEE00; border-radius: 8px; font-size: 13px; color: #303030; font-weight: bold;">
        💡 ${timeSavedHint}
      </div>`
    : "";

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #303030; color: white; padding: 24px; border-radius: 12px 12px 0 0;">
        <h1 style="margin: 0; font-size: 20px;">⚡ Deine Solvary-Auswertung</h1>
      </div>
      <div style="background: #ffffff; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px; padding: 24px;">
        <p style="color: #303030; font-size: 15px;">${greeting},</p>
        <p style="color: #303030; font-size: 15px;">
          dein größter Hebel ist <strong>${hero.name}</strong>.
        </p>
        <p style="color: #64748b; font-size: 14px;">${hero.tagline}</p>
        ${reasonsHtml}
        ${alsoRelevantHtml}
        ${timeSavedHtml}
        <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center;">
          <a href="https://solvary.de/check" style="color: #303030; font-weight: bold; text-decoration: none;">
            → Nochmal zur Auswertung
          </a>
        </div>
      </div>
    </div>
  `;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Solvary <noreply@solvary.de>",
      to: [to],
      subject: `Deine Auswertung: ${hero.name} ist dein größter Hebel`,
      html,
    }),
  });

  return new Response(JSON.stringify({ sent: res.ok, status: res.status }), {
    headers: { ...CORS, "Content-Type": "application/json" },
  });
});
