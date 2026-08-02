const LOG_PATH = "/_visitor-logs";
const MAX_RESULTS = 500;

function isHtmlVisit(request, url) {
  if (request.method !== "GET" || url.pathname === LOG_PATH) return false;

  const destination = request.headers.get("Sec-Fetch-Dest");
  const accept = request.headers.get("Accept") || "";
  const looksLikePage =
    url.pathname === "/" ||
    url.pathname.endsWith("/") ||
    url.pathname.endsWith(".html");

  return destination === "document" || (looksLikePage && accept.includes("text/html"));
}

function bearerToken(request) {
  const authorization = request.headers.get("Authorization") || "";
  return authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
}

async function logVisit(request, env, url) {
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const country = request.cf?.country || null;

  await env.VISITOR_DB.prepare(
    `INSERT INTO visits
      (visited_at, ip_address, country, path, referrer, user_agent)
     VALUES (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), ?1, ?2, ?3, ?4, ?5)`,
  )
    .bind(
      ip,
      country,
      `${url.pathname}${url.search}`,
      request.headers.get("Referer"),
      request.headers.get("User-Agent"),
    )
    .run();
}

async function readLogs(request, env, url) {
  if (!env.LOG_API_TOKEN || bearerToken(request) !== env.LOG_API_TOKEN) {
    return new Response("Unauthorized", {
      status: 401,
      headers: { "Cache-Control": "no-store" },
    });
  }

  const requestedLimit = Number.parseInt(url.searchParams.get("limit") || "100", 10);
  const limit = Number.isFinite(requestedLimit)
    ? Math.min(Math.max(requestedLimit, 1), MAX_RESULTS)
    : 100;
  const ip = url.searchParams.get("ip");

  const statement = ip
    ? env.VISITOR_DB.prepare(
        `SELECT id, visited_at, ip_address, country, path, referrer, user_agent
         FROM visits WHERE ip_address = ?1
         ORDER BY visited_at DESC LIMIT ?2`,
      ).bind(ip, limit)
    : env.VISITOR_DB.prepare(
        `SELECT id, visited_at, ip_address, country, path, referrer, user_agent
         FROM visits ORDER BY visited_at DESC LIMIT ?1`,
      ).bind(limit);

  const { results } = await statement.all();
  return Response.json(
    { count: results.length, visits: results },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === LOG_PATH) {
      return readLogs(request, env, url);
    }

    if (isHtmlVisit(request, url)) {
      ctx.waitUntil(
        logVisit(request, env, url).catch((error) => {
          console.error("Failed to record visit", error);
        }),
      );
    }

    return fetch(request);
  },

  async scheduled(_controller, env, ctx) {
    const configuredDays = Number.parseInt(env.RETENTION_DAYS || "30", 10);
    const retentionDays = Number.isFinite(configuredDays)
      ? Math.min(Math.max(configuredDays, 1), 365)
      : 30;

    ctx.waitUntil(
      env.VISITOR_DB.prepare(
        `DELETE FROM visits
         WHERE visited_at < strftime('%Y-%m-%dT%H:%M:%fZ', 'now', ?1)`,
      )
        .bind(`-${retentionDays} days`)
        .run(),
    );
  },
};
