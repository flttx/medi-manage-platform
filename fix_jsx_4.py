# -*- coding: utf-8 -*-
import os
import sys

# Try to find the file without hardcoding the path with Chinese characters if possible
# or just use the byte string for the path if needed.

# Get current dir
cwd = os.getcwd()
p = os.path.join(cwd, 'src', 'App.jsx')

try:
    with open(p, 'rb') as f:
        content = f.read().decode('utf-8')
except Exception as e:
    print(f"Error opening file: {e}")
    sys.exit(1)

search_pattern = 'tabular-nums tracking-tight ml-2">{currentRange()}</h3>'

lines = content.splitlines()
found = False
for i, line in enumerate(lines):
    if search_pattern in line and i + 2 < len(lines):
        if '</div>' in lines[i+1].strip() and '</div>' in lines[i+2].strip():
            print(f"Found target at line {i+1}")
            lines.insert(i+2, '               )}')
            found = True
            break

if found:
    with open(p, 'wb') as f:
        f.write('\n'.join(lines).encode('utf-8'))
    print("Successfully updated App.jsx")
else:
    print("Target not found. Current lines around potential match:")
    # Print some lines for debugging
    for idx, l in enumerate(lines):
        if 'currentRange()' in l:
            print(f"{idx}: {l}")
            if idx + 2 < len(lines):
                print(f"{idx+1}: {lines[idx+1]}")
                print(f"{idx+2}: {lines[idx+2]}")
    sys.exit(1)
