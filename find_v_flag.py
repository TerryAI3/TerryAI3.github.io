import re
import glob

files = glob.glob('/root/.openclaw/workspace/website-maintenance/assets/*.js')
pattern = re.compile(r'/[^/\n]{1,200}/[a-z]*v[a-z]*\b')

for f in files:
    with open(f, 'r') as file:
        content = file.read()
    matches = pattern.findall(content)
    for m in set(matches):
        if 'vendor' not in m and 'verify' not in m and 'svg' not in m:
            print(f"File {f} match: {m}")
