#!/usr/bin/env bash
set -euo pipefail
[[ $(uname -s) == Linux && $EUID == 0 ]] || { echo 'Run as root on a dedicated Linux server.' >&2; exit 1; }
apt-get update
apt-get install -y --no-install-recommends git gcc g++ make pkg-config libcap-dev libseccomp-dev libsystemd-dev
source_dir=$(mktemp -d /tmp/study-isolate-build.XXXXXX)
trap 'rm -rf "$source_dir"' EXIT
git clone https://github.com/ioi/isolate.git "$source_dir"
git -C "$source_dir" checkout 8f185bb37f3f23e29b33b0c7727c91c13429abe3
make -C "$source_dir" -j2 install
# Reserve a bounded UID range on this dedicated server, not the login user.
for uid in $(seq 60000 60007); do
  if getent passwd "$uid" >/dev/null; then echo 'Sandbox UID range is already used.' >&2; exit 1; fi
done
sed -i 's/^subid_user = isolate/# subid_user = isolate/; s/^# first_uid = 60000/first_uid = 60000/; s/^# first_gid = 60000/first_gid = 60000/; s/^# num_boxes = 1000/num_boxes = 8/' /usr/local/etc/isolate
install -m 644 "$(dirname "$0")/var-local-lib-isolate.mount" /etc/systemd/system/var-local-lib-isolate.mount
systemctl daemon-reload
systemctl enable --now var-local-lib-isolate.mount
systemctl enable --now isolate.service
/usr/local/bin/isolate --check-config
