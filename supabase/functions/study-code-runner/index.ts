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

// src/domain/code-example.ts
var MAX_CODE_TEXT = 2e5;
var MAX_CODE_OUTPUT = 1e5;

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

// src/server/code-runner.ts
var ONLINE_COMPILERS = {
  c: "gcc-13.2.0-c",
  cpp: "gcc-13.2.0",
  // Mono's provider locale loses Korean stdin/stdout; use the verified UTF-8 .NET runtime.
  csharp: "dotnetcore-6.0.425"
};
var cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Cache-Control": "no-store",
  "Content-Type": "application/json"
};
var json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: cors });
async function boundedText(response, limit) {
  const reader = response.body?.getReader();
  if (!reader) return "";
  const chunks = [];
  let size = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > limit)
        throw new DomainError(
          "TOO_LARGE",
          "\uC2E4\uD589 \uACB0\uACFC\uAC00 \uB108\uBB34 \uAE41\uB2C8\uB2E4. \uCD9C\uB825\uB7C9\uC744 \uC904\uC5EC \uB2E4\uC2DC \uC2E4\uD589\uD574 \uC8FC\uC138\uC694."
        );
      chunks.push(value);
    }
  } finally {
    await reader.cancel().catch(() => {
    });
  }
  const all = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    all.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(all);
}
async function compileOnline(source, signal, transport = fetch) {
  const response = await transport("https://wandbox.org/api/compile.json", {
    method: "POST",
    signal,
    redirect: "error",
    headers: { "Content-Type": "application/json", "User-Agent": "study-space-code-practice/1.0" },
    body: JSON.stringify({
      compiler: ONLINE_COMPILERS[source.language],
      code: source.code,
      stdin: source.stdin,
      options: source.language === "csharp" ? "" : "warning",
      ...source.language === "c" ? { "compiler-option-raw": "-std=c17" } : source.language === "cpp" ? { "compiler-option-raw": "-std=c++20" } : {
        codes: [
          {
            file: "NuGet.Config",
            code: '<?xml version="1.0" encoding="utf-8"?><configuration><packageSources><clear /></packageSources></configuration>'
          }
        ]
      },
      save: false
    })
  });
  if (!response.ok)
    throw new DomainError(
      "COMPILER_UNAVAILABLE",
      response.status === 429 ? "\uCEF4\uD30C\uC77C \uC11C\uBE44\uC2A4\uAC00 \uD63C\uC7A1\uD569\uB2C8\uB2E4. \uC7A0\uC2DC \uD6C4 \uB2E4\uC2DC \uC2E4\uD589\uD574 \uC8FC\uC138\uC694." : "\uCEF4\uD30C\uC77C \uC11C\uBE44\uC2A4\uC5D0 \uC5F0\uACB0\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4. \uCF54\uB4DC\uC640 \uC124\uBA85\uC740 \uC720\uC9C0\uD588\uC2B5\uB2C8\uB2E4."
    );
  const body = JSON.parse(await boundedText(response, 1e6));
  if (!body || typeof body.status !== "string" || typeof body.program_output !== "string" || typeof body.compiler_error !== "string" || typeof body.program_error !== "string")
    throw new DomainError(
      "COMPILER_RESPONSE",
      "\uC2E4\uD589 \uACB0\uACFC\uB97C \uD655\uC778\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4. \uCF54\uB4DC\uB294 \uC720\uC9C0\uD588\uC2B5\uB2C8\uB2E4."
    );
  const output = body.program_output.slice(0, MAX_CODE_OUTPUT);
  const error = [
    body.compiler_error || (body.status !== "0" && typeof body.compiler_output === "string" ? body.compiler_output : ""),
    body.program_error,
    typeof body.signal === "string" ? body.signal : ""
  ].filter(Boolean).join("\n").slice(0, MAX_CODE_OUTPUT);
  return {
    outcome: body.status === "0" && !body.signal ? "success" : "error",
    output,
    error
  };
}
async function handleCodeRequest(request, backend) {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  if (request.method !== "POST")
    return json({ code: "METHOD", message: "\uC9C0\uC6D0\uD558\uC9C0 \uC54A\uB294 \uC694\uCCAD\uC785\uB2C8\uB2E4." }, 405);
  let reserved;
  try {
    const authorization = request.headers.get("authorization");
    if (!authorization?.startsWith("Bearer "))
      throw new DomainError("AUTH_REQUIRED", "\uCF54\uB4DC\uB97C \uC2E4\uD589\uD558\uB824\uBA74 \uB0B4 \uACF5\uBD80 \uACF5\uAC04\uC5D0 \uB85C\uADF8\uC778\uD574 \uC8FC\uC138\uC694.");
    const userId = await backend.authenticate(authorization.slice(7));
    if (!userId) throw new DomainError("AUTH_REQUIRED", "\uB0B4 \uACF5\uBD80 \uACF5\uAC04\uC5D0 \uB2E4\uC2DC \uB85C\uADF8\uC778\uD574 \uC8FC\uC138\uC694.");
    requireApproved(await backend.access(userId));
    const body = JSON.parse(await boundedText(new Response(request.body), 15e5));
    if (!body || !Object.hasOwn(ONLINE_COMPILERS, body.language) || typeof body.code !== "string" || typeof body.stdin !== "string" || body.code.length > MAX_CODE_TEXT || body.stdin.length > MAX_CODE_TEXT || !body.code.trim())
      throw new DomainError("INVALID_CODE", "\uC5B8\uC5B4\xB7\uCF54\uB4DC\xB7\uC785\uB825\uAC12\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
    const source = { language: body.language, code: body.code, stdin: body.stdin };
    const job = crypto.randomUUID();
    await backend.reserve(userId, job);
    reserved = { userId, job };
    const signal = AbortSignal.any([request.signal, AbortSignal.timeout(35e3)]);
    const result = await backend.compile(source, signal);
    return json({
      ...source,
      ...result,
      at: (/* @__PURE__ */ new Date()).toISOString(),
      compiler: ONLINE_COMPILERS[source.language]
    });
  } catch (e) {
    const code = e instanceof DomainError ? e.code : e instanceof Error && ["TimeoutError", "AbortError"].includes(e.name) ? "CODE_TIMEOUT" : "COMPILER_UNAVAILABLE";
    const status = code === "AUTH_REQUIRED" ? 401 : code === "ACCESS_DENIED" ? 403 : ["CODE_RATE_LIMIT", "CODE_BUSY"].includes(code) ? 429 : ["INVALID_CODE", "TOO_LARGE"].includes(code) || e instanceof SyntaxError ? 400 : 503;
    return json(
      {
        code,
        message: e instanceof DomainError ? e.message : code === "CODE_TIMEOUT" ? "\uC2E4\uD589 \uC751\uB2F5 \uC2DC\uAC04\uC774 \uCD08\uACFC\uB418\uC5C8\uC2B5\uB2C8\uB2E4. \uC785\uB825\uC740 \uC720\uC9C0\uD588\uC2B5\uB2C8\uB2E4." : "\uCEF4\uD30C\uC77C \uC11C\uBE44\uC2A4\uC5D0 \uC5F0\uACB0\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4. \uC785\uB825\uC740 \uC720\uC9C0\uD588\uC2B5\uB2C8\uB2E4."
      },
      status
    );
  } finally {
    if (reserved)
      await backend.release(reserved.userId, reserved.job).catch(() => {
      });
  }
}

// supabase/functions/study-code-runner/entry.ts
var url = Deno.env.get("SUPABASE_URL");
var anon = Deno.env.get("SUPABASE_ANON_KEY");
var service = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
async function rpc(name, body) {
  const response = await fetch(`${url}/rest/v1/rpc/${name}`, {
    method: "POST",
    headers: {
      apikey: service,
      Authorization: `Bearer ${service}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
  if (response.status === 204) return null;
  const result = await response.json();
  if (!response.ok) {
    const code = ["CODE_RATE_LIMIT", "CODE_BUSY", "ACCESS_DENIED"].find(
      (code2) => result.message?.includes(code2)
    ) ?? "COMPILER_UNAVAILABLE";
    throw new DomainError(
      code,
      code === "CODE_RATE_LIMIT" ? "\uC2E4\uD589 \uD69F\uC218 \uC81C\uD55C\uC5D0 \uB3C4\uB2EC\uD588\uC2B5\uB2C8\uB2E4. \uC7A0\uC2DC \uB4A4 \uB610\uB294 \uB2E4\uC74C \uB0A0 \uB2E4\uC2DC \uC2E4\uD589\uD574 \uC8FC\uC138\uC694." : code === "CODE_BUSY" ? "\uC55E\uC120 \uC2E4\uD589\uC774 \uB05D\uB09C \uB4A4 \uB2E4\uC2DC \uC2E4\uD589\uD574 \uC8FC\uC138\uC694." : code === "ACCESS_DENIED" ? "\uAD00\uB9AC\uC790 \uC2B9\uC778\uC774 \uD544\uC694\uD558\uAC70\uB098 \uC774\uC6A9\uC774 \uC911\uC9C0\uB418\uC5B4 \uC788\uC2B5\uB2C8\uB2E4." : "\uC2E4\uD589 \uC5F0\uACB0\uC744 \uD655\uC778\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4. \uC785\uB825\uC740 \uC720\uC9C0\uD588\uC2B5\uB2C8\uB2E4."
    );
  }
  return result;
}
Deno.serve(
  (request) => handleCodeRequest(request, {
    async authenticate(token) {
      const response = await fetch(`${url}/auth/v1/user`, {
        headers: { apikey: anon, Authorization: `Bearer ${token}` }
      });
      return response.ok ? (await response.json()).id : "";
    },
    access: (userId) => rpc("study_account_access", { p_user: userId }),
    reserve: async (userId, job) => {
      await rpc("study_reserve_code_run", { p_user: userId, p_job: job });
    },
    release: async (userId, job) => {
      await rpc("study_finish_code_run", { p_user: userId, p_job: job });
    },
    compile: compileOnline
  })
);
