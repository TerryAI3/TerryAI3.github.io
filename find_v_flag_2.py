import re
import glob

files = glob.glob('/root/.openclaw/workspace/website-maintenance/assets/*.js')
# match something like /pattern/v or /pattern/gv
pattern = re.compile(r'/([^/]+)/([a-z]*v[a-z]*)\b')

for f in files:
    with open(f, 'r') as file:
        content = file.read()
    matches = pattern.findall(content)
    for m in set(matches):
        if 'vendor' not in m[1] and 'verify' not in m[1] and 'svg' not in m[0] and m[0] != '2000':
            print(f"File {f} match: /{m[0]}/{m[1]}")
