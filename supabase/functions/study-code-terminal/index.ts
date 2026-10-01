// src/domain/model.ts
var DomainError = class extends Error {
  constructor(code, message, details) {
    super(message);
    this.code = code;
    this.details = details;
    this.name = "DomainError";
  }
  code;
  details;
};

// src/server/account-access.ts
var accessMessages = {
  pending: "\uAD00\uB9AC\uC790\uAC00 \uAC00\uC785\uC744 \uC2B9\uC778\uD558\uBA74 \uB0B4 \uACF5\uBD80 \uACF5\uAC04\uC744 \uC0AC\uC6A9\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.",
  approved: "\uC774\uC6A9\uC774 \uC2B9\uC778\uB418\uC5C8\uC2B5\uB2C8\uB2E4.",
  rejected: "\uAC00\uC785 \uC694\uCCAD\uC774 \uC2B9\uC778\uB418\uC9C0 \uC54A\uC558\uC2B5\uB2C8\uB2E4. \uC774\uC6A9\uC774 \uD544\uC694\uD558\uBA74 \uAD00\uB9AC\uC790\uC5D0\uAC8C \uBB38\uC758\uD574 \uC8FC\uC138\uC694.",
  suspended: "\uD604\uC7AC \uC774\uC6A9\uC774 \uC911\uC9C0\uB418\uC5B4 \uC788\uC2B5\uB2C8\uB2E4. \uAE30\uC874 \uAE30\uB85D\uC740 \uC0AD\uC81C\uD558\uC9C0 \uC54A\uC558\uC2B5\uB2C8\uB2E4. \uAD00\uB9AC\uC790\uC5D0\uAC8C \uBB38\uC758\uD574 \uC8FC\uC138\uC694."
};
function requireApproved(access) {
  if (access.status !== "approved") throw new DomainError("ACCESS_DENIED", accessMessages[access.status] ?? accessMessages.pending);
}

// src/server/code-terminal-access.ts
var headers = {
  "Content-Type": "application/json",
  "Cache-Control": "no-store",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};
var json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers });
async function handleTerminalAccess(request, backend) {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers });
  if (request.method !== "POST") return json({ message: "\uC9C0\uC6D0\uD558\uC9C0 \uC54A\uB294 \uC694\uCCAD\uC785\uB2C8\uB2E4." }, 405);
  try {
    const authorization = request.headers.get("authorization");
    if (!authorization?.startsWith("Bearer ")) throw new DomainError("AUTH_REQUIRED", "\uB2E4\uC2DC \uB85C\uADF8\uC778\uD574 \uC8FC\uC138\uC694.");
    const user = await backend.authenticate(authorization.slice(7));
    if (!user) throw new DomainError("AUTH_REQUIRED", "\uB2E4\uC2DC \uB85C\uADF8\uC778\uD574 \uC8FC\uC138\uC694.");
    const reader = request.body?.getReader();
    if (!reader) throw new DomainError("INVALID_REQUEST", "\uC694\uCCAD\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
    let text = "";
    try {
      while (true) {
        const part = await reader.read();
        if (part.done) break;
        text += new TextDecoder().decode(part.value);
        if (text.length > 2048) throw new DomainError("INVALID_REQUEST", "\uC694\uCCAD\uC774 \uB108\uBB34 \uAE41\uB2C8\uB2E4.");
      }
    } finally {
      await reader.cancel().catch(() => {
      });
    }
    const body = JSON.parse(text);
    if (body.action === "release" && /^[a-f0-9-]{36}$/.test(body.job ?? "")) {
      await backend.release(user, body.job);
      return json({ released: true });
    }
    requireApproved(await backend.access(user));
    if (body.action === "check") return json({ allowed: true });
    if (body.action !== "reserve") throw new DomainError("INVALID_REQUEST", "\uC694\uCCAD\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
    const job = crypto.randomUUID();
    await backend.reserve(user, job);
    return json({ job });
  } catch (error) {
    const code = error instanceof DomainError ? error.code : "SERVER_ERROR";
    return json(
      { code, message: error instanceof DomainError ? error.message : "\uC2E4\uD589 \uC5F0\uACB0\uC744 \uD655\uC778\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4." },
      code === "AUTH_REQUIRED" ? 401 : code === "ACCESS_DENIED" ? 403 : ["CODE_BUSY", "CODE_RATE_LIMIT"].includes(code) ? 429 : code === "INVALID_REQUEST" || error instanceof SyntaxError ? 400 : 503
    );
  }
}

// supabase/functions/study-code-terminal/entry.ts
var url = Deno.env.get("SUPABASE_URL");
var anon = Deno.env.get("SUPABASE_ANON_KEY");
var service = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
async function rpc(name, body) {
  const response = await fetch(`${url}/rest/v1/rpc/${name}`, { method: "POST", headers: {
    apikey: service,
    Authorization: `Bearer ${service}`,
    "Content-Type": "application/json"
  }, body: JSON.stringify(body), signal: AbortSignal.timeout(8e3) });
  if (response.status === 204) return null;
  const result = await response.json();
  if (!response.ok) {
    const code = ["CODE_BUSY", "CODE_RATE_LIMIT", "ACCESS_DENIED"].find((c) => result.message?.includes(c)) ?? "SERVER_ERROR";
    throw new DomainError(code, code === "CODE_BUSY" ? "\uC55E\uC120 \uC2E4\uD589\uC774 \uB05D\uB09C \uB4A4 \uB2E4\uC2DC \uC2E4\uD589\uD574 \uC8FC\uC138\uC694." : code === "CODE_RATE_LIMIT" ? "\uC2E4\uD589 \uD69F\uC218 \uC81C\uD55C\uC5D0 \uB3C4\uB2EC\uD588\uC2B5\uB2C8\uB2E4. \uC7A0\uC2DC \uD6C4 \uB2E4\uC2DC \uC2E4\uD589\uD574 \uC8FC\uC138\uC694." : "\uC774\uC6A9 \uC2B9\uC778\uC744 \uD655\uC778\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.");
  }
  return result;
}
Deno.serve((request) => handleTerminalAccess(request, {
  async authenticate(token) {
    const response = await fetch(`${url}/auth/v1/user`, { headers: { apikey: anon, Authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(8e3) });
    return response.ok ? (await response.json()).id : "";
  },
  access: (user) => rpc("study_account_access", { p_user: user }),
  reserve: async (user, job) => {
    await rpc("study_reserve_code_terminal", { p_user: user, p_job: job });
  },
  release: async (user, job) => {
    await rpc("study_finish_code_run", { p_user: user, p_job: job });
  }
}));
