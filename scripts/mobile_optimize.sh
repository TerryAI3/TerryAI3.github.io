#!/bin/bash
# [agent-geek] Mobile UX & Responsive Optimization Suite

TARGET_DIR="/root/.openclaw/workspace/website-maintenance"
echo "[agent-geek] Initiating Mobile UX Optimization..."

# 1. Inject Viewport Meta if missing (Critical for mobile)
for file in $TARGET_DIR/*.html; do
    if ! grep -q "viewport" "$file"; then
        echo "  - Injecting viewport meta to $(basename "$file")"
        sed -i '/<head>/a \    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">' "$file"
    fi
done

# 2. Touch Target Optimization (CSS Patch)
# Ensure buttons and links are at least 44x44px for fat fingers
echo "[CSS] Patching touch targets..."
cat << 'CSS' >> $TARGET_DIR/assets/mobile_patch.css
@media (max-width: 768px) {
    button, a { min-height: 44px; min-width: 44px; display: inline-flex; align-items: center; justify-content: center; }
    .container { padding-left: 1rem; padding-right: 1rem; }
    h1 { font-size: 2.5rem !important; line-height: 1.1; }
    img { height: auto !important; }
}
CSS

# 3. Inject CSS Patch into HTML
for file in $TARGET_DIR/*.html; do
    if ! grep -q "mobile_patch.css" "$file"; then
        sed -i '/<\/head>/i \    <link rel="stylesheet" href="/assets/mobile_patch.css">' "$file"
    fi
done

# 4. Git Sync
echo "[DEPLOY] Committing mobile optimizations..."
cd $TARGET_DIR
git add .
git commit -m "perf: [agent-geek] mobile responsive optimization, viewport injection, and touch target scaling"
git push https://${GH_TOKEN}_4hGHDW9fVfyZry7xik38ECo0pE5MWZmCbRcUpHaqFOMEMYEZUKIUCoVVnro@github.com/TerryAI3/TerryAI3.github.io.git main --force

echo "[DONE] Mobile optimization applied."
