#!/usr/bin/env bash
set -euo pipefail
[[ $(uname -s) == Linux && $EUID == 0 ]] || { echo 'Run as root on a dedicated Ubuntu 24.04 server.' >&2; exit 1; }
terminal_domain=${1:?Supply the hostname pointing to this dedicated server}
[[ $terminal_domain =~ ^[A-Za-z0-9.-]+$ && $terminal_domain != .* ]] || exit 1
source_dir=$(cd -- "$(dirname -- "$0")" && pwd)
if [[ -e /etc/caddy/Caddyfile ]] && ! grep -q '^# study-terminal-managed$' /etc/caddy/Caddyfile; then
  echo 'Existing Caddy configuration requires a separate reviewed installation.' >&2; exit 1
fi
systemctl stop study-code-terminal.service 2>/dev/null || true
apt-get update
apt-get install -y --no-install-recommends curl ca-certificates xz-utils caddy dotnet-sdk-8.0
bash "$source_dir/install-isolate.sh"
# Download the official Node 24 build and check its published checksum.
node_arch=$(uname -m)
case "$node_arch" in x86_64) node_arch=x64;; aarch64) node_arch=arm64;; *) exit 1;; esac
node_dir=$(mktemp -d /tmp/study-node-install.XXXXXX)
trap 'rm -rf "$node_dir"' EXIT
curl -fsSL https://nodejs.org/dist/latest-v24.x/SHASUMS256.txt -o "$node_dir/SHASUMS256.txt"
node_archive=$(awk -v a="linux-$node_arch.tar.xz" '$2 ~ a"$" {print $2}' "$node_dir/SHASUMS256.txt")
[[ $node_archive =~ ^node-v24\.[0-9]+\.[0-9]+-linux-(x64|arm64)\.tar\.xz$ ]] || exit 1
curl -fsSL "https://nodejs.org/dist/latest-v24.x/$node_archive" -o "$node_dir/$node_archive"
(cd "$node_dir" && awk -v f="$node_archive" '$2==f' SHASUMS256.txt | sha256sum --check)
mkdir -p /opt/study-node
tar -xJf "$node_dir/$node_archive" -C /opt/study-node --strip-components=1
id study-terminal >/dev/null 2>&1 || useradd --system --no-create-home --shell /usr/sbin/nologin study-terminal
install -d -m 755 /opt/study-code-terminal
for file in gateway.mjs linux-runtime.mjs package.json package-lock.json; do install -m 644 "$source_dir/$file" /opt/study-code-terminal/; done
(cd /opt/study-code-terminal && PATH="/opt/study-node/bin:$PATH" npm ci --omit=dev)
if [[ ! -e /etc/study-code-terminal.env ]]; then
  cat > /etc/study-code-terminal.env <<'ENV'
SUPABASE_URL=https://lbuiwotjisbzgflixjvg.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_eH5R55A-CkA_suZHSkoeGw_BvOmAxRD
TERMINAL_ORIGINS=https://skmsmjs-netizen.github.io
ENV
  chmod 640 /etc/study-code-terminal.env
  chown root:study-terminal /etc/study-code-terminal.env
fi
cat > /etc/caddy/Caddyfile <<CADDY
# study-terminal-managed
$terminal_domain {
  handle /terminal {
    reverse_proxy 127.0.0.1:8090
  }
  handle /health {
    reverse_proxy 127.0.0.1:8090
  }
  handle {
    respond "Not found" 404
  }
}
CADDY
caddy validate --config /etc/caddy/Caddyfile
install -m 644 "$source_dir/study-code-terminal.service" /etc/systemd/system/study-code-terminal.service
systemctl daemon-reload
systemctl enable --now study-code-terminal.service
systemctl reload caddy
curl --fail --retry 5 --retry-delay 2 http://127.0.0.1:8090/health
printf '\nSet the app repository CODE_TERMINAL_URL variable to wss://%s/terminal after HTTPS health passes.\n' "$terminal_domain"
