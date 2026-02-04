
import os
import sys

# Use relative path if possible or just handle it carefully
# The script is in d:\Projects\医患管理平台
p = 'src/App.jsx'

try:
    with open(p, 'rb') as f:
        content = f.read().decode('utf-8')
except FileNotFoundError:
    print(f"File {p} not found in {os.getcwd()}")
    sys.exit(1)

search_pattern = 'tabular-nums tracking-tight ml-2">{currentRange()}</h3>'

lines = content.splitlines()
found = False
for i, line in enumerate(lines):
    if search_pattern in line and i + 2 < len(lines):
        if '</div>' in lines[i+1] and '</div>' in lines[i+2]:
            print(f"Found target at line {i+1}")
            # The structure we want is:
            # i: h3
            # i+1: </div>
            # (Insert here): )}
            # i+2: </div>
            lines.insert(i+2, '               )}')
            found = True
            break

if found:
    with open(p, 'wb') as f:
        f.write('\n'.join(lines).encode('utf-8'))
    print("Successfully updated App.jsx")
else:
    print("Target not found")
    sys.exit(1)
