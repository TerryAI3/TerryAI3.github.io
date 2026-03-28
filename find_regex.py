import re

with open('/root/.openclaw/workspace/website-maintenance/assets/index-T7eFSBbb.js', 'r') as f:
    content = f.read()

# Try to find /.../v or /.../vi or /.../iv or /.../gv etc., but avoiding URLs
# regex literal: / followed by not /, then / followed by flags including v
pattern = re.compile(r'/([^/]+)/([a-z]*v[a-z]*)')
matches = pattern.findall(content)
for m in set(matches):
    print(f"Match: /{m[0]}/{m[1]}")
