# -*- coding: utf-8 -*-
import os
import sys

# Get current dir
cwd = os.getcwd()
p = os.path.join(cwd, 'src', 'App.jsx')

try:
    with open(p, 'rb') as f:
        content = f.read().decode('utf-8')
except Exception as e:
    print "Error opening file: " + str(e)
    sys.exit(1)

search_pattern = u'tabular-nums tracking-tight ml-2">{currentRange()}</h3>'

lines = content.splitlines()
found = False
for i, line in enumerate(lines):
    if search_pattern in line and i + 2 < len(lines):
        if '</div>' in lines[i+1].strip() and '</div>' in lines[i+2].strip():
            print "Found target at line " + str(i+1)
            lines.insert(i+2, u'               )}')
            found = True
            break

if found:
    with open(p, 'wb') as f:
        f.write(u'\n'.join(lines).encode('utf-8'))
    print "Successfully updated App.jsx"
else:
    print "Target not found. Current lines around potential match:"
    for idx, l in enumerate(lines):
        if 'currentRange()' in l:
            print str(idx) + ": " + l.encode('utf-8')
    sys.exit(1)
