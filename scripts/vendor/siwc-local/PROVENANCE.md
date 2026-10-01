# Official Sign in with ChatGPT local runtime

Source: https://github.com/openai/sign-in-with-chatgpt-devkit
Commit: f723814abdccec135b519c451fb6e1992ee5e933
Scope: packages/local/src, LICENSE, THIRD_PARTY_NOTICES.md. Noncommercial local personal project.

The published repository defines @siwc/local as a workspace; npm has no package. Source is pinned here so sign-in, ID-token validation, secure persistence, renewal and completed Responses streaming reuse the official runtime. Local modifications are documented below.

Local modifications (2026-10-01): types.ts adds beforeCredentialChange; oauth.ts calls it after validated callback before code exchange/registration persistence; index.ts calls it before verified token storage. These modifications are under the included same DevKit license. The hook revalidates the initiating Study Space owner session and current approval. All other runtime source is unchanged.
