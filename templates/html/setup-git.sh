#!/bin/bash
# setup-git.sh — run at start of any Cowork/Claude session to arm git push
# Fetches GITHUB_TOKEN from Asgard vault and configures git credentials
# Usage: source setup-git.sh  OR  bash setup-git.sh

TOKEN=$(curl -s "https://asgard-vault.pgallivan.workers.dev/secret/GITHUB_TOKEN" -H "X-Pin: 535554")

if [ -z "$TOKEN" ] || echo "$TOKEN" | grep -q '"error"'; then
  echo "❌ Failed to fetch GITHUB_TOKEN from vault"
  echo "   Response: $TOKEN"
  exit 1
fi

git config --global user.name "Paddy Gallivan"
git config --global user.email "pgallivan@outlook.com"
git config --global credential.helper store
echo "https://LuckDragonAsgard:${TOKEN}@github.com" > ~/.git-credentials
chmod 600 ~/.git-credentials

echo "✅ Git configured — push/pull to github.com/Luck-Dragon-Pty-Ltd and github.com/PaddyGallivan ready"
